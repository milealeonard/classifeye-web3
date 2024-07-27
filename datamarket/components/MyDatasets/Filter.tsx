import React from "react";
import styles from "./MyDatasets.module.css";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";
import { DatasetWithIndex } from "../../constants";
import { TextField } from "../TextField";

const Filter = ({
  datasets,
  allDatasets,
  setDatasets,
}: {
  datasets: DatasetWithIndex[];
  allDatasets: DatasetWithIndex[];
  setDatasets: React.Dispatch<React.SetStateAction<DatasetWithIndex[]>>;
}) => {
  const [filterSelect, setFilterSelect] = React.useState(false);
  const [filter, setFilter] = React.useState<string | undefined>(undefined);

  const changeFilter = (value: string): void => {
    setFilter(value);
    if (value) {
      let trimmedFilter = value.trim();
      if (trimmedFilter.length) {
        setDatasets(() => {
          return allDatasets.filter((ds) => {
            return (
              ds.description
                .toLowerCase()
                .includes(trimmedFilter.toLowerCase()) ||
              ds.name.toLowerCase().includes(trimmedFilter.toLowerCase())
            );
          });
        });
      } else {
        setDatasets(allDatasets);
      }
    } else {
      setDatasets(allDatasets);
    }
  };

  const toggleFilterSelect = (filterSelect: boolean): boolean => {
    return !filterSelect;
  };

  return (
    <div className={styles.dropdown}>
      <div className={styles.dropdownCategories}>
        <div
          className={`${styles.rotateDrop} ${
            filterSelect ? styles.rotateDropdown : ""
          }`}
        >
          <button
            onClick={() => setFilterSelect(toggleFilterSelect(filterSelect))}
          >
            <ArrowForwardIosRoundedIcon
              sx={{ width: "32px", height: "32px" }}
              className={styles.dropBtn}
            />
          </button>
        </div>
        <p>Filter</p>
      </div>
      {filterSelect && (
        <div className={styles.dropdownOptions}>
          <TextField
            onChange={(event) => {
              changeFilter(event.target.value);
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
