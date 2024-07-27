import React from "react";
import { Dataset, DatasetVisibility, DatasetWithIndex } from "../../constants";
import AddIcon from "@mui/icons-material/Add";
import { DatasetView } from "./DatasetView";
import { useRouter } from "next/router";
import SettingsIcon from "@mui/icons-material/Settings";
import styles from "./MyDatasets.module.css";
import ClearIcon from "@mui/icons-material/Clear";
import { SideBar } from "./SideBar";
import { Utils } from "./Utils";
import AddButton from "./AddButton";

export const ListDatasets = ({
  forOwnersOnly,
  datasets,
  accounts,
  liteMode,
}: {
  forOwnersOnly?: boolean;
  datasets: DatasetWithIndex[];
  accounts: string[];
  liteMode?: boolean;
}): React.ReactElement => {
  const [sidePanelHidden, setSidePanelHidden] = React.useState(true);
  const [sortedDatasets, setSortedDatasets] = React.useState(datasets);

  const shouldDatasetBeHidden = (dataset: Dataset): boolean => {
    return dataset.visibility === DatasetVisibility.PRIVATE && !forOwnersOnly;
  };

  const toggleSidePanel = (): void => {
    setSidePanelHidden(!sidePanelHidden);
  };


  return (
    <div className="flex flex-col w-full">
      <AddButton />
      <div className={`${styles.galleryContainer}`}>
        {sortedDatasets
          .filter(
            (dataset: DatasetWithIndex) => !shouldDatasetBeHidden(dataset)
          )
          .map((dataset: DatasetWithIndex) => {
            return (
              <div className="p-2">
                <DatasetView
                  key={dataset.index}
                  dataset={dataset}
                  accounts={accounts}
                  publicIndex={dataset.index}
                  forOwnersOnly={forOwnersOnly}
                  liteMode={liteMode}
                />
              </div>
            );
          })}
      </div>
        <div className={styles.rightSide}>
          {sidePanelHidden && (
            <button onClick={toggleSidePanel} className={styles.settings}>
              <SettingsIcon sx={{ width: "48px", height: "48px" }} />
            </button>
          )}
          <div
            className={`${styles.sidepanel}  ${
              !sidePanelHidden ? styles.sidepanelSlide : ""
            }`}
          >
            <button onClick={toggleSidePanel}>
              <ClearIcon
                sx={{ width: "48px", height: "48px"}}
              />
            </button>
            <SideBar
              datasets={sortedDatasets}
              allDatasets = {datasets}
              setDatasets={setSortedDatasets}
            />
          </div>
        </div>
      </div>
  );
};

