import React from "react";
import { Dataset, DatasetVisibility } from "../constants";
import AddIcon from '@mui/icons-material/Add';
import { DatasetView } from "./DatasetView";
import { useRouter } from "next/router";
import { Button } from "./Button";
import SettingsIcon from '@mui/icons-material/Settings';
import { FormatAlignJustify, Remove } from "@mui/icons-material";
import RemoveIcon from '@mui/icons-material/Remove';
import { Transition } from '@headlessui/react';
import styles from './ListDatasets.module.css';
import CancelIcon from '@mui/icons-material/Cancel';
import ClearIcon from '@mui/icons-material/Clear';

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
  const [sidePanelHidden, setSidePanelHidden] = React.useState(true);
  
  const shouldDatasetBeHidden = (dataset: Dataset): boolean => {
    return dataset.visibility === DatasetVisibility.PRIVATE && !forOwnersOnly;
  };

  const toggleSidePanel = () : void => {
    setSidePanelHidden(!sidePanelHidden);
  }
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
    <div className="flex flex-col w-full">
      <div className="flex flex-wrap justify-between w-full">
        <div className= "flex flex-col items-center mr-20 border border-2 h-screen" style={{width:"200px", backgroundColor:"rgb(12,13,70)"}}>
          <div className="flex justify-center gap-1 border-2 border-gray-300 hover:border-blue-300 rounded-md p-2 content-center items-center bg-white text-black  w-add h-add mb-7 mt-2">
            <button onClick={navToNew} className={"p-2 border-2 border-blue-500 rounded-full hover:bg-blue-300 transition-colors duration-300 ease-in-out"}>
                <AddIcon sx={{width:"64px", height:"64px"}}/>
            </button>
          </div>
          <div className="flex justify-center gap-1 border-2 border-gray-300 hover:border-blue-300 rounded-md p-2 content-center items-center bg-white text-black  w-add h-add ">
            <button onClick={navToNew} className={"p-2 border-2 border-blue-500 rounded-full hover:bg-blue-300 transition-colors duration-300 ease-in-out"}>
                <RemoveIcon sx={{width:"64px", height:"64px"}}/>
            </button>
          </div>
        </div>
      <div className=" flex flex-wrap justify-center px-4 w-1/2 border h-1/2">
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
      <div className = "flex flex-row">
          <button onClick={toggleSidePanel} style= {{height: "64px", padding: "10px", display: "flex", alignItems:"center"}}>
              <SettingsIcon sx={{width: "48px", height: "48px", cursor:"pointer"}}/>
          </button>
          <div className={`${styles.sidepanel}  ${!sidePanelHidden ? styles.sidepanelSlide: ''}`}>
            <button onClick={toggleSidePanel} style= {{height: "48px", display: "flex", alignItems:"center", marginBottom: "10px", color: "black"}}>
                <ClearIcon sx={{width: "48px", height: "48px", cursor:"pointer"}}/>
            </button>
            <div className={styles.dropdown}>
              <p>Sort</p>
              <p> Filter</p>
              <p> View </p>
            </div>
          </div>
      </div>
      </div>
    </div>
  );
};
