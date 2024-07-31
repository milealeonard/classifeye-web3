import React from "react";
import {
  DatasetWithIndex,
  FilterType,
  SortType,
  ViewType,
} from "../../constants";
import { DatasetView } from "./DatasetView";
import SettingsIcon from "@mui/icons-material/Settings";
import styles from "./MyDatasets.module.css";
import ClearIcon from "@mui/icons-material/Clear";
import AddButton from "./AddButton";
import { sortDatasets, filterDatasets } from "@/utils/utils";
import Sort from "./Sort";
import View from "./View";
import Filter from "./Filter";

export const ListDatasets = ({
  forOwnersOnly,
  datasets,
  setDatasets,
  accounts,
  liteMode,
}: {
  forOwnersOnly?: boolean;
  datasets: DatasetWithIndex[];
  setDatasets: React.Dispatch<React.SetStateAction<DatasetWithIndex[]>>;
  accounts: string[];
  liteMode?: boolean;
}): React.ReactElement => {
  const [allDatasets, setAllDatasets] =
    React.useState<DatasetWithIndex[]>(datasets);
  const [sidePanelHidden, setSidePanelHidden] = React.useState(true);
  const [filter, setFilter] = React.useState<FilterType | undefined>(undefined);
  const [sortOption, setSortOption] = React.useState<SortType | undefined>(
    undefined
  );
  const [viewOption, setViewOption] = React.useState<ViewType>("Gallery");

  const toggleSidePanel = (): void => {
    setSidePanelHidden(!sidePanelHidden);
  };

  React.useEffect(() => {
    console.log(allDatasets);
    console.log(filter);
    setDatasets(() => {
      return sortDatasets(filterDatasets(allDatasets, filter), sortOption);
    });
  }, [sortOption, filter]);

  return (
    <div className="flex flex-col w-full">
      <AddButton />
      <div className={`${styles.galleryContainer}`}>
        {datasets.map((dataset: DatasetWithIndex) => {
          return (
            <DatasetView
              key={dataset.index}
              dataset={dataset}
              accounts={accounts}
              publicIndex={dataset.index}
              forOwnersOnly={forOwnersOnly}
              liteMode={liteMode}
              viewOption={viewOption}
            />
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
            <ClearIcon sx={{ width: "48px", height: "48px" }} />
          </button>
          <div className={styles.dropdownContainer}>
            <Sort sortOption={sortOption} setSortOption={setSortOption} />
            <View viewOption={viewOption} setViewOption={setViewOption} />
            <Filter filter={filter} setFilter={setFilter} />
          </div>
        </div>
      </div>
    </div>
  );
};
