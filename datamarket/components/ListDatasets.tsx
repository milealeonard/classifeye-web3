import React from "react";
import { Dataset, DatasetVisibility } from "../constants";
import AddIcon from '@mui/icons-material/Add';
import { DatasetView } from "./DatasetView";
import { useRouter } from "next/router";
import { Button } from "./Button";

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
  const router = useRouter();
  const shouldDatasetBeHidden = (dataset: Dataset): boolean => {
    return dataset.visibility === DatasetVisibility.PRIVATE && !forOwnersOnly;
  };

  const navToNew = (): void => {
    router.push("new");
  }

  const datasetsToBeShown = datasets.filter(
    (dataset: Dataset) => !shouldDatasetBeHidden(dataset)
  );

  if (!datasetsToBeShown.length) {
    return (
      <div className=" flex flex-wrap w-full px-6">
        <div className="p-2">
            <div className="flex flex-col gap-1 border-4 border-black rounded-md p-2 content-center items-center bg-white text-black  w-add h-add ">
              <p>hellp</p>
            </div>
        </div>
      </div>
    )
  }

  return (
    <div className=" flex flex-wrap justify-center w-full px-6">
      <div className="flex justify-center items-center p-2">
          <div className="flex flex-col justify-center gap-1 border-2 border-gray-300 hover:border-blue-300 rounded-md p-2 content-center items-center bg-white text-black  w-add h-add ">
          <div className= "border-2 border-blue-500 rounded-full hover:bg-blue-300 transition-colors duration-300 ease-in-out">
            <Button onClick={navToNew} removeOutline={true} padding={"p-2"}>
                <AddIcon sx={{width:"64px", height:"64px"}}/>
            </Button>
            </div>
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
