import React from "react";
import styles from "./MyDatasets.module.css";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";
import { SortType } from "../../constants";
import SingleSelect from "../SingleSelect";

const Sort = ({
  sortOption,
  setSortOption,
}: {
  sortOption: SortType;
  setSortOption: React.Dispatch<React.SetStateAction<SortType>>;
}) => {
  const sortOptions: SortType[] = ["Price ↑", "Price ↓", "Name ↑", "Name ↓"];
  const [sortSelect, setSortSelect] = React.useState(false);

  const toggleSortSelect = (sortSelect: boolean): boolean => {
    return !sortSelect;
  };
  return (
    <div className={styles.dropdown}>
      <div className={styles.dropdownCategories}>
        <button
          onClick={() => setSortSelect(toggleSortSelect(sortSelect))}
          className={`${styles.rotateDrop} ${
            sortSelect ? styles.rotateDropdown : ""
          }`}
        >
          <ArrowForwardIosRoundedIcon
            sx={{ width: "32px", height: "32px" }}
            className={styles.dropBtn}
          />
        </button>
        <p>Sort</p>
      </div>
      <SingleSelect
        list={sortOptions}
        selected={sortSelect}
        option={sortOption}
        changeOption={setSortOption}
      />
    </div>
  );
};

export default Sort;
