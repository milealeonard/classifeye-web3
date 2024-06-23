import React from "react";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { Dataset } from "../constants";
import DownloadIcon from "@mui/icons-material/Download";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import EditIcon from "@mui/icons-material/Edit";
import {
  decryptAndDownload,
  purchaseDataset,
  unzipFiles,
  userOwnsDataset,
} from "../utils/utils";
import { Button } from "./Button";
import { useRouter } from "next/router";

export const DatasetView = ({
  dataset,
  accounts,
  publicIndex,
  forOwnersOnly,
  liteMode,
}: {
  dataset: Dataset;
  accounts: string[];
  // must pass in which idx this dataset has when listed via public method
  publicIndex: number | undefined;
  forOwnersOnly?: boolean;
  liteMode?: boolean;
}): React.ReactElement => {
  const router = useRouter();
  const [imgUrls, setImgUrls] = React.useState<any | undefined>(undefined);
  // dont care to load imgs for lite mode
  const [imgsLoading, setImgsLoading] = React.useState(!liteMode);
  const [showImgs, setShowImgs] = React.useState(false);

  const isOwner = userOwnsDataset(dataset, accounts);
  const shouldShowThisDataset = !forOwnersOnly || isOwner;

  React.useEffect(() => {
    (async () => {
      if (!shouldShowThisDataset || liteMode) {
        return;
      }
      try {
        if (dataset.sample) {
          const res = await fetch(
            `https://gateway.pinata.cloud/ipfs/${dataset.sample}`
          );
          const resJson = await res.json();
          const { imgUrls: unzippedUrls } = await unzipFiles(resJson);
          setImgUrls(unzippedUrls);
        }
      } finally {
        setImgsLoading(false);
      }
    })();
  }, []);

  const purchaseDatasetWrapper = async (): Promise<void> => {
    if (publicIndex === undefined) {
      console.error("AHHHHH");
      return;
    }
    await purchaseDataset(publicIndex, Number(dataset.price));
  };

  const navToUpdate = (): void => {
    router.push(`update/${publicIndex}`);
  };
  const navToResume = (): void => {
    router.push(`resume/${publicIndex}`);
  };

  const downloadDataset = (): void => {
    // decryptAndView({ cid: dataset.data, account: accounts[0] });
    decryptAndDownload({ cid: dataset.data, account: accounts[0] });
  };

  if (!shouldShowThisDataset) {
    return <></>;
  }

  return (
    <div className="flex flex-col gap-1 border-4 border-black rounded-md p-2 content-center items-center bg-white text-black w-full">
          <div className="flex flex-row gap-5 items-center justify-end w-full">
            {isOwner && publicIndex !== undefined && (
              <Button onClick={navToUpdate} removeOutline={true}>
                <EditIcon sx={{ width: "24px", height: "24px" }} />
              </Button>
            )}
            {isOwner && publicIndex !== undefined && (
              <Button onClick={downloadDataset} removeOutline={true}>
                <DownloadIcon sx={{ width: "24px", height: "24px" }} />
              </Button>
            )}
            {imgUrls?.length && (
              <Button onClick={() => setShowImgs((prev) => !prev)} removeOutline={true}>
                {showImgs ? (
                  <VisibilityOffIcon sx={{ width: "24px", height: "24px" }} />
                ) : (
                  <VisibilityIcon sx={{ width: "24px", height: "24px" }} />
                )}
              </Button>
            )}
          </div>
          <div className="flex flex-col gap-1 items-center">
            <h3>{dataset.name}</h3>
            <p>{dataset.description}</p>
          </div>
          <div className="flex flex-col gap-1 items-start">
            <p>Price: ${Number(dataset.price)}</p>
          </div>
          {isOwner && publicIndex !== undefined && (
            <div className="border-2 border-blue-500 rounded-full px-3 hover:bg-blue-300">
              <Button onClick={navToResume} removeOutline={true}>
                <p>View Dataset</p>
              </Button>
            </div>
          )}
          {!liteMode && showImgs && (
            <div className="max-h-96 overflow-auto flex flex-col items-center gap-3">
              {imgsLoading && <p>Imgs Loading...</p>}
              {!imgsLoading && !!imgUrls.length && <p>Images: </p>}
              {imgUrls?.map((url: string, index: number) => (
                <img
                  key={index}
                  src={url}
                  alt={`ht-${index}`}
                  style={{ maxWidth: "300px" }}
                />
              ))}
            </div>
          )}
    </div>
  );
  
};
