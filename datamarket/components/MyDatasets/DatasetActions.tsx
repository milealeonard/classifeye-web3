import React from "react";
import { DatasetWithIndex } from "../../constants";
import DownloadIcon from "@mui/icons-material/Download";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import { decryptAndDownload } from "../../utils/utils";
import { Button } from "../Button";
import { useRouter } from "next/router";

export const DatasetActions = ({
  isOwner,
  publicIndex,
  dataset,
  accounts,
  showIcons,
}: {
  isOwner?: boolean;
  publicIndex: number | undefined;
  dataset: DatasetWithIndex;
  accounts: string[];
  showIcons: boolean;
}) => {
  const router = useRouter();
  const navToView = (): void => {
    router.push(`view/${dataset.sample}`);
  };
  const navToUpdate = (): void => {
    router.push(`update/${publicIndex}`);
  };

  const downloadDataset = (): void => {
    decryptAndDownload({ cid: dataset.data, account: accounts[0] });
  };

  if (!showIcons) {
    return <></>;
  }

  return (
    <div className="justify-center">
      <div className="flex flex-row gap-5 items-center justify-between">
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
    </div>
  );
};
