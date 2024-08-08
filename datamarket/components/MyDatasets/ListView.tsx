import React from "react";
import { DatasetWithIndex, ViewType } from "../../constants";
import { useRouter } from "next/router";
import { useWindowSize } from "@/hooks/hooks";
import { DatasetActions } from "./DatasetActions";
import { DatasetDetails } from "./DatasetDetails";

export const ListView = ({
  isOwner,
  publicIndex,
  dataset,
  accounts,
}: {
  isOwner?: boolean;
  publicIndex: number | undefined;
  dataset: DatasetWithIndex;
  accounts: string[];
}) => {
  const router = useRouter();
  const { width } = useWindowSize();

  const navToResume = (): void => {
    router.push(`resume/${publicIndex}`);
  };

  return (
    <div className="flex flex-col gap-1 border-2 border-gray-300 hover:border-red-400 rounded-md p-2 content-center items-center bg-white text-black w-full">
      <div className="flex flex-row justify-between w-full">
        <DatasetDetails
          dataset={dataset}
          showDescription={width > 960}
          viewType={ViewType.LIST}
        />
        <DatasetActions
          dataset={dataset}
          publicIndex={publicIndex}
          accounts={accounts}
          showIcons={width > 960}
          isOwner={isOwner}
        />
        <div>
          {isOwner && publicIndex !== undefined && (
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
      </div>
    </div>
  );
};
