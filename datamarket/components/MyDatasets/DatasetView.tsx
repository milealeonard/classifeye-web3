import React from "react";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { Dataset } from "../../constants";
import DownloadIcon from "@mui/icons-material/Download";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import EditIcon from "@mui/icons-material/Edit";
import {
  decryptAndDownload,
  purchaseDataset,
  unzipFiles,
  userOwnsDataset,
} from "../../utils/utils";
import { Button } from "../Button";
import { useRouter } from "next/router";

interface DatasetViewProps {
  dataset: Dataset;
  accounts: string[];
  // must pass in which idx this dataset has when listed via public method
  publicIndex: number | undefined;
  forOwnersOnly?: boolean;
  liteMode?: boolean;
}

export const DatasetView = ({
  dataset,
  accounts,
  publicIndex,
  forOwnersOnly,
  liteMode,
}: DatasetViewProps): React.ReactElement => {
  const router = useRouter();
  const isOwner = userOwnsDataset(dataset, accounts);
  const shouldShowThisDataset = !forOwnersOnly || isOwner;

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

  const navToView = (): void => {
    router.push(`view/${dataset.sample}`);
  };

  const downloadDataset = (): void => {
    decryptAndDownload({ cid: dataset.data, account: accounts[0] });
  };

  if (!shouldShowThisDataset) {
    return <></>;
  }

  return (
    <div className="flex flex-col gap-1 border-2 border-gray-300 hover:border-red-400 rounded-md p-2 content-center items-center bg-white text-black w-full">
      <div className="flex flex-row gap-5 items-center justify-center w-full">
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
        <Button onClick={() => navToView()} removeOutline={true}>
          <VisibilityIcon sx={{ width: "24px", height: "24px" }} />
        </Button>
      </div>
      <div className="flex flex-col gap-1 items-center">
        <h3>{dataset.name}</h3>
        <p>{dataset.description}</p>
      </div>
      <div className="flex flex-col gap-1 items-start">
        <p>Price: ${Number(dataset.price)}</p>
      </div>
      {isOwner && publicIndex !== undefined && (
        // <div className="border-2 border-blue-500 rounded-full px-3 hover:bg-blue-300 transition-colors duration-300 ease-in-out">
        <button
          onClick={navToResume}
          className={
            "border-2 border-red-400 rounded-full py-2 px-4 hover:bg-red-100 transition-colors duration-300 ease-in-out"
          }
        >
          <p>View Dataset</p>
        </button>
      )}
    </div>
  );
};
