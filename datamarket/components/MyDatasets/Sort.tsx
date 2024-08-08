import React from "react";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";
import { DatasetWithIndex, SortType } from "../../constants";
import SingleSelect from "../SingleSelect";
import { sortDatasets } from "@/utils/utils";

const Sort = ({
  sortOption,
  setSortOption,
  datasets,
  setDatasets,
}: {
  sortOption: SortType;
  setSortOption: React.Dispatch<React.SetStateAction<string>>;
  datasets: DatasetWithIndex[];
  setDatasets: React.Dispatch<React.SetStateAction<DatasetWithIndex[]>>;
}) => {
  const sortOptions: string[] = [
    SortType.PRICE_ASCENDING,
    SortType.PRICE_DESCEDING,
    SortType.NAME_ASCENDING,
    SortType.NAME_DESCENDING,
  ];
  const [sortSelect, setSortSelect] = React.useState(false);

  const toggleSortSelect = (sortSelect: boolean): boolean => {
    return !sortSelect;
  };

  const changeSortOption = (option: string) => {
    setSortOption(option);
    setDatasets(sortDatasets(datasets, option));
  };

  return (
    <div className="flex flex-col justify-start items-center w-4/5">
      <div className="flex flex-row justify-between w-full">
        <button
          onClick={() => setSortSelect(toggleSortSelect(sortSelect))}
          className={`transform ${
            sortSelect ? "rotate-90" : "rotate-0"
          } transition-transform duration-100 ease-in-out`}
        >
          <ArrowForwardIosRoundedIcon sx={{ width: "32px", height: "32px" }} />
        </button>
        <p className="min-w-[100px]">Sort</p>
      </div>
      <SingleSelect
        list={sortOptions}
        selected={sortSelect}
        option={sortOption}
        changeOption={changeSortOption}
      />
    </div>
  );
};

export default Sort;
