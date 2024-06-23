import React from "react";
import { Dataset, DatasetVisibility } from "../constants";

import { DatasetView } from "./DatasetView";

export const ListDatasets = ({
  forOwnersOnly,
  datasets,
  accounts,
  liteMode,
}: {
  forOwnersOnly?: boolean;
  datasets: Dataset[];
  accounts: string[];
  liteMode?: boolean;
}): React.ReactElement => {
  const shouldDatasetBeHidden = (dataset: Dataset): boolean => {
    return dataset.visibility === DatasetVisibility.PRIVATE && !forOwnersOnly;
  };

  const datasetsToBeShown = datasets.filter(
    (dataset: Dataset) => !shouldDatasetBeHidden(dataset)
  );

  if (!datasetsToBeShown.length) {
    return <p>No datasets yet...</p>;
  }

  return (
    // <div className="flex flex-wrap justify-center w-full">
    <div className=" flex flex-wrap justify-left w-full px-6">
          {/* <div className="gap-1 border-4 border-black rounded-md content-center bg-white text-black h-46"> 
      </div> */}
      <div className="p-2">
          <div className="flex flex-col gap-1 border-4 border-black rounded-md p-2 content-center items-center bg-white text-black  w-add h-add ">
            <p>hellp</p>
          </div>
      </div>
      {datasets.map((dataset: Dataset, index: number) => {
        if (shouldDatasetBeHidden(dataset)) {
          return <></>;
        }
        return (
          <div className="p-2">
          <DatasetView
            key={index}
            dataset={dataset}
            accounts={accounts}
            publicIndex={index}
            forOwnersOnly={forOwnersOnly}
            liteMode={liteMode}
          />
          </div>
        );
      })}
      </div>
    // </div>
  );
};
