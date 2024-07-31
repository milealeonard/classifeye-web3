import React from "react";
import { DatasetWithIndex } from "@/constants";
import { useRouter } from "next/router";
import { DatasetActions } from "./DatasetActions";

export const GalleryView = ({
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

  const navToResume = (): void => {
    router.push(`resume/${publicIndex}`);
  };

  return (
    <div className="flex flex-col gap-1 border-2 border-gray-300 hover:border-red-400 rounded-md p-2 content-center items-center bg-white text-black">
      <DatasetActions
        dataset={dataset}
        publicIndex={publicIndex}
        accounts={accounts}
        showIcons={true}
        isOwner={isOwner}
      />
      <div className="flex flex-col gap-1 items-center">
        <h3>{dataset.name}</h3>
        <p>{dataset.description}</p>
      </div>
      <div className="flex flex-col gap-1 items-start">
        <p>Price: ${Number(dataset.price)}</p>
      </div>
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
  );
};
