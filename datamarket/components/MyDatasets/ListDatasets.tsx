import React from "react";
import { DatasetWithIndex, SortType, ViewType } from "../../constants";
import { DatasetView } from "./DatasetView";
import SettingsIcon from "@mui/icons-material/Settings";
import ClearIcon from "@mui/icons-material/Clear";
import AddButton from "./AddButton";
import { sortDatasets, filterDatasets } from "@/utils/utils";
import Sort from "./Sort";
import View from "./View";
import Filter from "./Filter";

/**
 *
 * @param forOwnersOnly marks whether a given dataset should only be seen by the owner
 * @param datasets datasets to show on marketplace
 * @param accounts account holder for each dataset
 * @returns
 */
export const ListDatasets = ({
  forOwnersOnly,
  datasets,
  setDatasets,
  accounts,
}: {
  datasets: DatasetWithIndex[];
  setDatasets: React.Dispatch<React.SetStateAction<DatasetWithIndex[]>>;
  accounts: string[];
  forOwnersOnly?: boolean;
}): React.ReactElement => {
  const [sidePanelHidden, setSidePanelHidden] = React.useState(true);
  const [filter, setFilter] = React.useState<string | undefined>(undefined);
  const [sortOption, setSortOption] = React.useState<SortType | undefined>(
    undefined
  );
  const [viewOption, setViewOption] = React.useState<string>(ViewType.GALLERY);

  const toggleSidePanel = (): void => {
    setSidePanelHidden(!sidePanelHidden);
  };

  return (
    <div className="flex flex-col w-full">
      <AddButton />
      <div className="flex flex-wrap justify-center px-1 w-3/5 absolute left-[20%] mt-[57.33px]">
        {filterDatasets(datasets, filter).map((dataset: DatasetWithIndex) => {
          return (
            <DatasetView
              key={dataset.index}
              dataset={dataset}
              accounts={accounts}
              publicIndex={dataset.index}
              forOwnersOnly={forOwnersOnly}
              viewOption={viewOption}
            />
          );
        })}
      </div>
      <div className="flex justify-end w-[275px] fixed right-0 top-0 mt-[57.33px]">
        {sidePanelHidden && (
          <button
            onClick={toggleSidePanel}
            className="h-16 p-2.5 absolute top-0 right-0"
          >
            <SettingsIcon sx={{ width: "48px", height: "48px" }} />
          </button>
        )}
        <div
          className={`border-2 border-lightcoral transition-transform duration-400 ease-in-out h-screen w-1/5 max-w-[200px] bg-white fixed right-0 top-[5.5%] ${
            !sidePanelHidden ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <button onClick={toggleSidePanel}>
            <ClearIcon sx={{ width: "48px", height: "48px" }} />
          </button>
          <div className="flex flex-col items-center text-black w-full mt-8 gap-4 text-2xl">
            <Sort
              sortOption={sortOption}
              setSortOption={setSortOption}
              datasets={datasets}
              setDatasets={setDatasets}
            />
            <View viewOption={viewOption} setViewOption={setViewOption} />
            <Filter filter={filter} setFilter={setFilter} />
          </div>
        </div>
      </div>
    </div>
  );
};
