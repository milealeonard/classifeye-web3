import { EthEncryptedData } from "@metamask/eth-sig-util";
import JSZip from "jszip";
import {
  ClassiFile,
  CreateCSVProps,
  CreateDatasetProps,
  Dataset,
  EncryptedDataAndSample,
  GREATERTHAN10TOLETTER,
  ImgNameAndUrl,
  MAX_SAMPLE_SIZE_COUNT,
  ProviderAndAccountKey,
  UnzippedContent,
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
}): Promise<UnzippedContent> => {
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

  return await unzipFiles(decryptedData);
};

export const parseLabelsFromClassifile = (
  classifiles: ClassiFile[]
): string[] => {
  const allLabels = [];
  classifiles.forEach((file: ClassiFile) => {
    file.classif.split(", ").forEach((label: string) => {
      if (label && !allLabels.includes(label)) {
        allLabels.push(label);
      }
    });
  });
  return allLabels;
};

export const decryptDataset = async ({
  cid,
  account,
}: {
  cid: string;
  account;
}): Promise<ClassiFile | undefined> => {
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
  const { imgUrls } = await unzipFiles(decryptedData);
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

export const unzipFiles = async (base64String): Promise<UnzippedContent> => {
  const zip = new JSZip();
  const content = await zip.loadAsync(base64String, { base64: true });
  const imgs: ImgNameAndUrl[] = [];

  let lines = null;
  const files: ClassiFile[] = [];

  for (const fileName in content.files) {
    if (/\.(png|jpg|jpeg|gif)$/i.test(fileName)) {
      const imgData = await content.files[fileName].async("blob");
      imgs.push({
        blobby: new File([imgData], fileName, { type: imgData.type }),
        url: URL.createObjectURL(imgData),
        name: fileName,
      });
    } else if (/\.(csv)$/i.test(fileName)) {
      const textData = await content.files[fileName].async("text");
      lines = textData.split("\n");
    }
  }

  if (lines) {
    // start on 1 to skip the img
    for (let i = 1; i < lines.length; i++) {
      const currLine = lines[i].split(", ");
      if (!currLine) {
        continue;
      }

      const grader = currLine[0];
      const imageName = currLine[1];
      const classifs = currLine[2];
      const foundImg = imgs.find(
        (img: ImgNameAndUrl) => img.name === imageName
      );
      if (!foundImg) {
        console.log("couldn't find img");
        console.log(imageName, imgs);
        continue;
      }
      files.push({
        blobby: foundImg.blobby,
        content: foundImg.url,
        name: foundImg.name,
        grader: grader,
        classif: classifs.replace(/\[|\]/g, ""),
      });
    }
  }

  return {
    imgUrls: imgs.map((img: ImgNameAndUrl) => img.url),
    files: files,
  };
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
  const { data: createdDatasetCid, sample: createdSampleCid } =
    await encryptAndZipData({ grader, images, publicKeyProp });

  // @ts-ignore
  const provider = new ethers.providers.Web3Provider(window.ethereum);

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

export async function attachImagesToDataset(dsToImage: Map<[Dataset, number], string[]>, ds: Dataset, index: number): Promise<void> {
  try {
    if (ds.sample) {
      const res = await fetch(
        `https://gateway.pinata.cloud/ipfs/${ds.sample}`
      );
      const resJson = await res.json();
      const { imgUrls: unzippedUrls } = await unzipFiles(resJson);
      /* Make a map that attaches the image url to the correlated dataset, then send the dataset and image url together */ 
      dsToImage.set([ds, index], unzippedUrls);

      // setImgUrls(unzippedUrls);
    }
    } finally {
      // setImgsLoading(false);
    }
};

export const encryptAndZipData = async ({
  grader,
  images,
  publicKeyProp,
}: CreateCSVProps): Promise<EncryptedDataAndSample> => {
  let publicKey = publicKeyProp;
  if (!publicKey) {
    const retVal = await initiateWalletConnection();
    publicKey = retVal.key;
  }
  const csvFile = createCSVFile({
    grader,
    images,
  });

  const imagesToZip = images.map((img) => img.blobby);
  const sampleFilesToZip = imagesToZip.slice(0, MAX_SAMPLE_SIZE_COUNT);
  const filesToZip = [...imagesToZip.slice(0, MAX_SAMPLE_SIZE_COUNT), csvFile];

  const createdSampleCid = await uploadFiles(sampleFilesToZip);
  const createdDatasetCid = await encryptAndUploadFiles(publicKey, filesToZip);
  console.log(createdDatasetCid, filesToZip);

  return { sample: createdSampleCid, data: createdDatasetCid };
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

/**
 * silly util to do some sort of hex representation to show which index item it is for user
 */
export const getShowableIndex = (index: number): string | undefined => {
  if (GREATERTHAN10TOLETTER.has(index)) {
    return GREATERTHAN10TOLETTER.get(index);
  } else if (index < 10) {
    return (index + 1).toString();
  }
  return undefined;
};
