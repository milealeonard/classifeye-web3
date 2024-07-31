import React from "react";
import { DatasetWithIndex } from "../../constants";
import { useRouter } from "next/router";
import { useWindowSize } from "@/hooks/hooks";
import { DatasetActions } from "./DatasetActions";

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
        <DatasetDetails dataset={dataset} width={width} />
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

const DatasetDetails = ({
  dataset,
  width,
}: {
  dataset: DatasetWithIndex;
  width: number;
}) => {
  return (
    <div className="flex flex-wrap justify-between content-center w-1/2 text-left">
      <p className="w-1/4 font-bold content-center">{dataset.name}</p>
      {width > 960 && (
        <p className="w-1/4 content-center">{dataset.description}</p>
      )}
      <p className="w-1/4 italic content-center">${+dataset.price}</p>
    </div>
  );
};
