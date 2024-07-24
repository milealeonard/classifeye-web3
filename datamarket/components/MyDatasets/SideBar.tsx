import React from "react";
import { DatasetWithIndex } from "../../constants";
import styles from "./MyDatasets.module.css";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";
import { sortDatasets } from "@/utils/utils";
import { SortType, ViewType, FilterType } from "../../constants";

export const SideBar = ({
  datasets,
  setDatasets,
}: {
  datasets: DatasetWithIndex[];
  setDatasets: React.Dispatch<React.SetStateAction<DatasetWithIndex[]>>;
}): React.ReactElement => {
  return (
    <div className={styles.dropdownContainer}>
      <Sort datasets={datasets} setDatasets={setDatasets} />
      <View />
      <Filter />
    </div>
  );
};

const Sort = ({
  datasets,
  setDatasets,
}: {
  datasets: DatasetWithIndex[];
  setDatasets: React.Dispatch<React.SetStateAction<DatasetWithIndex[]>>;
}) => {
  const sortOptions: SortType[] = ["Ascending", "Descending"];
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
      <div className={styles.dropdownOptions}>
        {sortSelect && (
          <div>
            {sortOptions.map((option) => (
              <div
                key={option}
                onClick={() => changeSortOption(option)}
                className={`${styles.selectOption} ${
                  option === sortOption ? styles.selected : ""
                }`}
              >
                {option.slice(0)}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const View = () => {
  const viewOptions: ViewType[] = ["Gallery", "List"];
  const [viewSelect, setViewSelect] = React.useState(false);
  const [viewOption, setViewOption] = React.useState<ViewType>();

  const changeViewOption = (option: ViewType): void => {
    setViewOption(option);
  };

  const toggleViewSelect = (viewSelect: boolean): boolean => {
    return !viewSelect;
  };

  return (
    <div className={styles.dropdown}>
      <div className={styles.dropdownCategories}>
        <div
          className={`${styles.rotateDrop} ${
            viewSelect ? styles.rotateDropdown : ""
          }`}
        >
          <button onClick={() => setViewSelect(toggleViewSelect(viewSelect))}>
            <ArrowForwardIosRoundedIcon
              sx={{ width: "32px", height: "32px" }}
              className={styles.dropBtn}
            />
          </button>
        </div>
        <p>View</p>
      </div>
      <div className={styles.dropdownOptions}>
        {viewSelect && (
          <div>
            {viewOptions.map((option) => (
              <div
                key={option}
                onClick={() => changeViewOption(option)}
                className={`${styles.selectOption} ${
                  option === viewOption ? styles.selected : ""
                }`}
              >
                {option.slice(0)}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const Filter = () => {
  const filterOptions: FilterType[] = ["Blah", "Bleh"];
  const [filterSelect, setFilterSelect] = React.useState(false);
  const [filterOption, setFilterOption] = React.useState<FilterType[]>([]);

  const changeFilterOption = (option: FilterType): void => {
    setFilterOption((currentOptions) => {
      if (currentOptions.includes(option)) {
        return currentOptions.filter((x) => x != option);
      } else {
        return [...currentOptions, option];
      }
    });
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
      <div className={styles.dropdownOptions}>
        {filterSelect && (
          <div>
            {filterOptions.map((option) => (
              <div
                key={option}
                onClick={() => changeFilterOption(option)}
                className={`${styles.selectOption} ${styles.multi} ${
                  filterOption.includes(option) ? styles.selectedMulti : ""
                }`}
              >
                {option.slice(0)}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
