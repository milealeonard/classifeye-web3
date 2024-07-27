import React from "react";
import { DatasetWithIndex } from "../../constants";
import styles from "./MyDatasets.module.css";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";
import { sortDatasets } from "@/utils/utils";
import { SortType, ViewType, FilterType } from "../../constants";
import SingleSelect from "../SingleSelect";

const Sort = ({
  datasets,
  setDatasets,
}: {
  datasets: DatasetWithIndex[];
  setDatasets: React.Dispatch<React.SetStateAction<DatasetWithIndex[]>>;
}) => {
  const sortOptions: SortType[] = ["Price ↑", "Price ↓"];
  const [sortSelect, setSortSelect] = React.useState(false);
  const [sortOption, setSortOption] = React.useState<SortType>();

  const changeSortOption = (option: SortType): void => {
    setSortOption(option);
    setDatasets(sortDatasets(datasets, option));
  };
  const toggleSortSelect = (sortSelect: boolean): boolean => {
    return !sortSelect;
  };
  return (
    <div className={styles.dropdown}>
      <div className={styles.dropdownCategories}>
        <div
          className={`${styles.rotateDrop} ${
            sortSelect ? styles.rotateDropdown : ""
          }`}
        >
          <button onClick={() => setSortSelect(toggleSortSelect(sortSelect))}>
            <ArrowForwardIosRoundedIcon
              sx={{ width: "32px", height: "32px" }}
              className={styles.dropBtn}
            />
          </button>
        </div>
        <p>Sort</p>
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
