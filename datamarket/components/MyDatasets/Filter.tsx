import React from "react";
import styles from "./MyDatasets.module.css";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";
import { TextField } from "../TextField";

const Filter = ({
  filter,
  setFilter,
}: {
  filter: string;
  setFilter: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const [filterSelect, setFilterSelect] = React.useState(false);
  const toggleFilterSelect = (filterSelect: boolean): boolean => {
    return !filterSelect;
  };

  return (
    <div className={styles.dropdown}>
      <div className={styles.dropdownCategories}>
        <button
          onClick={() => setFilterSelect(toggleFilterSelect(filterSelect))}
          className={`${styles.rotateDrop} ${
            filterSelect ? styles.rotateDropdown : ""
          }`}
        >
          <ArrowForwardIosRoundedIcon
            sx={{ width: "32px", height: "32px" }}
            className={styles.dropBtn}
          />
        </button>
        <p>Filter</p>
      </div>
      {filterSelect && (
        <div className={styles.dropdownOptions}>
          <TextField
            onChange={(event) => {
              setFilter(event.target.value);
            }}
            value={filter}
            placeholder="..."
            textSize="text-xl"
          />
        </div>
      )}
    </div>
  );
};

export default Filter;
