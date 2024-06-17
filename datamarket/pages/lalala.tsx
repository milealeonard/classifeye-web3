import { useState, useRef } from "react";
import Head from "next/head";
import Image from "next/image";
import Files from "@/components/Files";
import * as sigUtil from "@metamask/eth-sig-util";
import { ethers } from "ethers";
import JSZip from "jszip";
import { EthEncryptedData } from "@metamask/eth-sig-util";
import { ProviderAndAccountKey } from "./constants";

// TODO: type this out
// const fileToBase64 = (file) => {
//   return new Promise((resolve, reject) => {
//     const reader = new FileReader();
//     // @ts-ignore
//     reader.onload = () => resolve(reader.result.split(",")[1]);
//     reader.onerror = reject;
//     reader.readAsDataURL(file);
//   });
// };

// TODO: type this out
function base64ToBlob(base64, contentType) {
  const byteCharacters = atob(base64);
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

// TODO: type this out
function downloadImageFromBase64(base64String, fileName) {
  const contentType = "image/png"; // Adjust if the image type is different
  const blob = base64ToBlob(base64String, contentType);
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url); // Clean up the URL.createObjectURL reference
}

const zipFiles = async (files) => {
  const zip = new JSZip();
  for (let i = 0; i < files.length; i++) {
    zip.file(files[i].name, files[i]);
  }
  const zippedContent = await zip.generateAsync({ type: "base64" });
  return zippedContent;
};

const unzipFile = async (base64String) => {
  const zip = new JSZip();
  const content = await zip.loadAsync(base64String, { base64: true });
  const imgUrls = [];

  for (const fileName in content.files) {
    console.log("filename", fileName);
    if (/\.(png|jpg|jpeg|gif)$/i.test(fileName)) {
      const imgData = await content.files[fileName].async("blob");
      imgUrls.push(URL.createObjectURL(imgData));
    }
  }

  return imgUrls;
};

export default function Home() {
  // TODO: remove default
  const [filesToView, setFilesToView] = useState<any[]>([]);
  const [cid, setCid] = useState(
    "QmQ9EKGt1URR3fbB6VcYfRoNYKMsGHSH6xApFc5rXqK6gW"
  );
  const [uploading, setUploading] = useState(false);

  // add a new state for the cid to decrypt
  const [pk, setPk] = useState<string | undefined>(undefined);
  const [stateAccount, setStateAccount] = useState<string | undefined>(
    undefined
  );
  const [stateProvider, setStateProvider] = useState<any | undefined>(
    undefined
  );

  const inputFile = useRef(null);

  const uploadFiles = async (filesToUpload) => {
    // if (!pk) {
    //   alert("Please connect wallet first");
    //   return;
    // }

    setUploading(true);
    // first zip everything together
    const stringifiedZippedFile = await zipFiles(filesToUpload);
    const encryptedData = await encryptFile(stringifiedZippedFile, pk);
    const encryptedBlob = new Blob([JSON.stringify(encryptedData)], {
      type: "application/json",
    });
    const formData = new FormData();
    formData.append("file", encryptedBlob, "testfile.zip");
    const res = await fetch("/api/files", {
      method: "POST",
      body: formData,
    });
    const ipfsHash = await res.text();
    setCid(ipfsHash);
    setUploading(false);
  };

  const handleChange = (e) => {
    if (!e.target.files.length) {
      return;
    }
    uploadFiles(e.target.files);
  };

  const getPublicKey = async (
    address,
    provider
  ): Promise<string | undefined> => {
    // @ts-ignore
    const publicKey = await window.ethereum.request({
      method: "eth_getEncryptionPublicKey",
      params: [address],
    });
    return publicKey;
  };

  const initiateWalletConnection = async (): Promise<ProviderAndAccountKey> => {
    try {
      // @ts-ignore
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      const account = accounts[0];
      setStateProvider(provider);
      setStateAccount(account);
      const publicKey = await getPublicKey(account, provider);
      if (publicKey) {
        setPk(publicKey);
      }
      return {
        provider,
        account,
      };
    } catch (error) {
      console.log(error);
    }
  };

  const encryptFile = async (data, publicKey) => {
    return await sigUtil.encrypt({
      publicKey,
      data: data,
      // https://github.com/MetaMask/eth-sig-util/blob/v4.0.0/src/encryption.ts#L40
      version: "x25519-xsalsa20-poly1305",
    });
  };

  const decryptAndDownload = async () => {
    const res = await fetch(`https://gateway.pinata.cloud/ipfs/${cid}`);
    const resultJson: EthEncryptedData = await res.json();

    const decryptedData = await decrypt(JSON.stringify(resultJson));
    downloadImageFromBase64(decryptedData, "decrypted-file.zip");
  };

  const decryptAndView = async () => {
    const res = await fetch(`https://gateway.pinata.cloud/ipfs/${cid}`);
    const resultJson: EthEncryptedData = await res.json();

    const decryptedData = await decrypt(JSON.stringify(resultJson));
    if (!decryptedData) {
      return;
    }
    const imgUrls = await unzipFile(decryptedData);
    setFilesToView(imgUrls);
  };

  const decrypt = async (text: string) => {
    let currProvider = stateProvider;
    let currAccount = stateAccount;
    if (!stateProvider || !stateAccount) {
      const { provider, account } = await initiateWalletConnection();
      currProvider = provider;
      currAccount = account;
    }

    const result = await currProvider.send("eth_decrypt", [text, currAccount]);
    return result;
  };

  return (
    <>
      <Head>
        <title>DataMarket</title>
        <meta name="description" content="Generated with create-pinata-app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/pinnie.png" />
      </Head>
      <main className="w-full min-h-screen m-auto flex flex-col justify-center items-center">
        <div className="w-1/2 flex flex-col gap-6">
          <input
            type="file"
            id="file"
            ref={inputFile}
            multiple
            onChange={handleChange}
            style={{ display: "none" }}
          />
          <div>
            <button
              onClick={initiateWalletConnection}
              className="mr-10 bg-light text-secondary border-2 border-secondary rounded-3xl py-2 px-4 hover:bg-secondary hover:text-light transition-all duration-300 ease-in-out"
            >
              Connect Wallet
            </button>
            <button
              disabled={uploading}
              onClick={() => inputFile.current.click()}
              className="bg-secondary text-light rounded-3xl py-2 px-4 hover:bg-accent hover:text-light transition-all duration-300 ease-in-out"
            >
              {uploading ? "Uploading..." : "Upload"}
            </button>
          </div>
          {cid && (
            <Files
              cid={cid}
              onDownload={decryptAndDownload}
              onView={decryptAndView}
              filesToView={filesToView}
              setCid={setCid}
            />
          )}
        </div>
      </main>
    </>
  );
}
