import React from "react";
import { Dataset, DatasetVisibility, DatasetWithIndex } from "../../constants";
import AddIcon from "@mui/icons-material/Add";
import { DatasetView } from "./DatasetView";
import { useRouter } from "next/router";
import SettingsIcon from "@mui/icons-material/Settings";
import styles from "./MyDatasets.module.css";;
import ClearIcon from "@mui/icons-material/Clear";
import { SideBar } from "./SideBar";
import { Utils } from "./Utils";

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

  const datasetsToBeShown = datasets.filter(
    (dataset: Dataset) => !shouldDatasetBeHidden(dataset)
  );

  // if (!datasetsToBeShown.length) {
  //   return <></>
  // }


  return (
    <div className="flex flex-col w-full">
      <div className="flex flex-wrap justify-between w-full">
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
        <div className="flex flex-row">
          <div className={styles.rightSide}>
            {sidePanelHidden && (
              <button
                onClick={toggleSidePanel}
                style={{
                  height: "64px",
                  padding: "10px",
                  position: "absolute",
                  top: "0",
                  right: "0",
                }}
              >
                <SettingsIcon
                  sx={{
                    width: "48px",
                    height: "48px",
                    cursor: "pointer",
                    marginRight: "10px",
                  }}
                />
              </button>
            )}
            <div
              className={`${styles.sidepanel}  ${
                !sidePanelHidden ? styles.sidepanelSlide : ""
              }`}
            >
              <button
                onClick={toggleSidePanel}
                style={{
                  height: "48px",
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "10px",
                  color: "black",
                }}
              >
                <ClearIcon
                  sx={{ width: "48px", height: "48px", cursor: "pointer" }}
                />
              </button>
              <SideBar datasets={sortedDatasets} setDatasets={setSortedDatasets} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const AddButton = () => {
  const router = useRouter();
  const navToNew = (): void => {
    router.push("new");
  };

  const { width } = Utils.useWindowSize();
  if (width > 960) {
    return (
      <div className={styles.add}>
        <div className="flex justify-center gap-1 border-2 border-gray-300  rounded-md p-2 content-center items-center bg-white text-black  w-add h-add mb-7 mt-2">
          <button
            onClick={navToNew}
            className={
              "p-2 border-2 border-red-400 rounded-full hover:bg-red-100 transition-colors duration-300 ease-in-out"
            }
          >
            <AddIcon sx={{ width: "64px", height: "64px" }} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.add}>
      <button
        onClick={navToNew}
        className={
          "p-2 border-2 border-red-400 hover:bg-blue-300 transition-colors duration-300 ease-in-out"
        }
      >
        <AddIcon sx={{ width: "32px", height: "32px" }} />
      </button>
    </div>
  );
};


