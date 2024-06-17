import { EthEncryptedData } from "@metamask/eth-sig-util";
import JSZip from "jszip";
import {
  ClassiFile,
  CreateCSVProps,
  CreateDatasetProps,
  Dataset,
  MAX_SAMPLE_SIZE_COUNT,
  ProviderAndAccountKey,
  UpdateDatasetProps,
} from "../constants";
import * as sigUtil from "@metamask/eth-sig-util";
import { ethers } from "ethers";
import { getDataMarketContract } from "./DataContractUtils";

//////////////////
// Wallet utils //
//////////////////

const initiateWalletConnection = async (): Promise<ProviderAndAccountKey> => {
  try {
    // @ts-ignore
    // const provider = new ethers.BrowserProvider(window.ethereum);
    // const provider = new ethers.providers.JsonRpcProvider(
    //   "http://127.0.0.1:7545"
    // );
    const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
    // Prompt user for account connections
    const accounts = await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    const account = accounts[0];
    const publicKey = await getPublicKey(account, provider);
    return {
      provider,
      account,
      key: publicKey,
    };
  } catch (error) {
    console.log(error);
  }
};

const getPublicKey = async (address, provider): Promise<string | undefined> => {
  // @ts-ignore
  const publicKey = await window.ethereum.request({
    method: "eth_getEncryptionPublicKey",
    params: [address],
  });
  return publicKey;
};

///////////////////////////
// Encryption/Decryption //
///////////////////////////
const decrypt = async ({
  text,
  provider,
  account,
}: {
  text: string;
  provider?: any;
  account?: any;
}) => {
  let currProvider = provider;
  let currAccount = account;
  if (!provider || !account) {
    const { provider, account } = await initiateWalletConnection();
    currProvider = provider;
    currAccount = account;
  }
  const result = await currProvider.send("eth_decrypt", [text, currAccount]);
  return result;
};

const encryptFile = async ({
  data,
  publicKey,
}: {
  data: string;
  publicKey: string;
}) => {
  return await sigUtil.encrypt({
    publicKey,
    data: data,
    // https://github.com/MetaMask/eth-sig-util/blob/v4.0.0/src/encryption.ts#L40
    version: "x25519-xsalsa20-poly1305",
  });
};

const encryptAndUploadFiles = async (
  pk,
  filesToUpload
): Promise<string | undefined> => {
  if (!pk) {
    alert("Please connect wallet first");
    return;
  }

  // first zip everything together
  const stringifiedZippedFile = await zipFiles(filesToUpload);
  const encryptedData = await encryptFile({
    data: stringifiedZippedFile,
    publicKey: pk,
  });
  const encryptedBlob = new Blob([JSON.stringify(encryptedData)], {
    type: "application/json",
  });
  return uploadFilesInner(encryptedBlob);
};

export const decryptAndView = async ({
  cid,
  account,
}: {
  cid: string;
  account;
}) => {
  const res = await fetch(`https://gateway.pinata.cloud/ipfs/${cid}`);
  const resultJson: EthEncryptedData = await res.json();
  // @ts-ignore
  const provider = new ethers.providers.Web3Provider(window.ethereum);

  const decryptedData = await decrypt({
    text: JSON.stringify(resultJson),
    provider,
    account,
  });
  if (!decryptedData) {
    return;
  }
  return await unzipFile(decryptedData);
  //   setFilesToView(imgUrls);
};

export const decryptAndDownload = async ({
  cid,
  account,
}: {
  cid: string;
  account: string;
}): Promise<void> => {
  const res = await fetch(`https://gateway.pinata.cloud/ipfs/${cid}`);
  const resultJson: EthEncryptedData = await res.json();
  // @ts-ignore
  const provider = new ethers.providers.Web3Provider(window.ethereum);

  const decryptedData = await decrypt({
    text: JSON.stringify(resultJson),
    provider,
    account,
  });
  if (!decryptedData) {
    return;
  }
  const contentType = "application/zip"; // Adjust if the image type is different
  const blob = base64ToBlob({
    base64String: decryptedData,
    contentType,
  });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "fileName.zip";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url); // Clean up the URL.createObjectURL reference
};

///////////////
// Zip/Unzip //
///////////////
const zipFiles = async (files) => {
  const zip = new JSZip();
  for (let i = 0; i < files.length; i++) {
    zip.file(files[i].name, files[i]);
  }
  const zippedContent = await zip.generateAsync({ type: "base64" });
  return zippedContent;
};

export const unzipFile = async (base64String) => {
  const zip = new JSZip();
  const content = await zip.loadAsync(base64String, { base64: true });
  const imgUrls = [];

  for (const fileName in content.files) {
    if (/\.(png|jpg|jpeg|gif)$/i.test(fileName)) {
      const imgData = await content.files[fileName].async("blob");
      imgUrls.push(URL.createObjectURL(imgData));
    }
  }

  return imgUrls;
};
function base64ToBlob({
  base64String,
  contentType,
}: {
  base64String: string;
  contentType: string;
}) {
  const byteCharacters = atob(base64String);
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += 512) {
    const slice = byteCharacters.slice(offset, offset + 512);

    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }

  return new Blob(byteArrays, { type: contentType });
}

/////////
// CSV //
/////////

/**
 * Create CSV file which will actually be a blob
 */
const createCSVFile = ({ grader, images }: CreateCSVProps): File => {
  const csvData = formatCSVData({ grader, images });

  // Create a Blob from the CSV data
  const blob = new Blob(csvData, { type: "text/csv" });

  // Create a File from the Blob
  const file = new File([blob], "classifications.csv", { type: "text/csv" });

  return file;
};

/**
 * Function which creates a CSV file with the classifications
 */
const formatCSVData = ({
  grader,
  images,
}: {
  grader: string;
  images: ClassiFile[];
}): string[] => {
  const legend = ["Grader, Image, Classification\n"];
  const actualData = images.map((image: ClassiFile) => {
    return `${grader}, ${image.name}, [${image.classif ?? ""}]\n`;
  });

  return legend.concat(actualData);
};

////////////////////
// Create Dataset //
////////////////////

export const createDataset = async ({
  _datasetName,
  _datasetDescription,
  _datasetVisibility,
  _datasetPrice,
  publicKeyProp,
  grader,
  images,
}: CreateDatasetProps): Promise<Dataset> => {
  let publicKey = publicKeyProp;
  if (!publicKey) {
    const retVal = await initiateWalletConnection();
    publicKey = retVal.key;
  }
  const csvFile = createCSVFile({
    grader,
    images,
  });
  //   TODO actually real one
  const imagesToZip = images.map((img) => img.blobby);
  const sampleFilesToZip = imagesToZip.slice(0, MAX_SAMPLE_SIZE_COUNT);
  const filesToZip = [...imagesToZip.slice(0, MAX_SAMPLE_SIZE_COUNT), csvFile];

  const createdSampleCid = await uploadFiles(sampleFilesToZip);
  const createdDatasetCid = await encryptAndUploadFiles(publicKey, filesToZip);

  // @ts-ignore
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  //   const provider = new ethers.providers.JsonRpcProvider(
  //     "http://127.0.0.1/7545"
  //   );
  await provider.send("eth_requestAccounts", []);
  const signer = await provider.getSigner();
  const dataMarketContract = getDataMarketContract(signer);

  await dataMarketContract.createDataset(
    _datasetName,
    _datasetDescription,
    createdDatasetCid,
    createdSampleCid,
    _datasetPrice,
    _datasetVisibility
  );
  return {
    owner: "placeholder",
    name: _datasetName,
    description: _datasetDescription,
    data: createdDatasetCid,
    sample: createdSampleCid,
    price: BigInt(_datasetPrice),
    visibility: _datasetVisibility,
  };
};

const uploadFiles = async (filesToUpload): Promise<string | undefined> => {
  // first zip everything together
  const stringifiedZippedFile = await zipFiles(filesToUpload);
  const blobby = new Blob([JSON.stringify(stringifiedZippedFile)], {
    type: "application/json",
  });
  return uploadFilesInner(blobby);
};

const uploadFilesInner = async (blob): Promise<string | undefined> => {
  const formData = new FormData();
  formData.append("file", blob, "testfile.zip");
  const res = await fetch("/api/files", {
    method: "POST",
    body: formData,
  });
  const ipfsHash = await res.text();
  return ipfsHash;
};

//////////////////////
// Purchase Dataset //
//////////////////////
export const purchaseDataset = async (
  index: number,
  price: number
): Promise<void> => {
  // @ts-ignore
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  await provider.send("eth_requestAccounts", []);
  const signer = await provider.getSigner();
  const dataMarketContract = getDataMarketContract(signer);
  const valueOption = { value: price };
  const success = await dataMarketContract.purchaseDataset(index, valueOption);
};

////////////////////
// Update Dataset //
////////////////////
export const updateDataset = async ({
  index,
  newName,
  newDescription,
  newData,
  newSample,
  newPrice,
  newVisibility,
}: UpdateDatasetProps): Promise<void> => {
  // @ts-ignore
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  await provider.send("eth_requestAccounts", []);
  const signer = await provider.getSigner();
  const dataMarketContract = getDataMarketContract(signer);
  await dataMarketContract.updateDataset(
    index,
    newName,
    newDescription,
    newData,
    newSample,
    newPrice,
    newVisibility
  );
};

//////////////////////////

/**
 * Create and download a CSV file
 */
const downloadCSVButton = ({ grader, images }: CreateCSVProps): void => {
  // Create a URL for the Blob
  const blob = createCSVFile({
    grader,
    images,
  });

  const url = window.URL.createObjectURL(blob);

  // Create an anchor element
  const a = document.createElement("a");
  a.href = url;
  a.download = "classifications.csv";

  // Trigger a click event to initiate the download
  a.click();

  // Clean up by revoking the URL
  window.URL.revokeObjectURL(url);
};

// TODO: type this out
function downloadImageFromBase64(base64String, fileName) {
  const contentType = "image/png"; // Adjust if the image type is different
  const blob = base64ToBlob({
    base64String,
    contentType,
  });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url); // Clean up the URL.createObjectURL reference
}

export const userOwnsDataset = (
  dataset: Dataset,
  accounts: string[]
): boolean => {
  return accounts.some(
    (address: string) => address.toLowerCase() === dataset.owner.toLowerCase()
  );
};
