import React from "react";
import { DatasetWithIndex } from "../../constants";
import styles from "./MyDatasets.module.css";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";
import { sortDatasets } from "@/utils/utils";
import { SortType, ViewType, FilterType } from "../../constants";
import SingleSelect from "../SingleSelect";
import Sort from "./Sort";
import View from "./View";
import Filter from "./Filter";
export const SideBar = ({
  datasets,
  allDatasets,
  setDatasets,
}: {
  datasets: DatasetWithIndex[];
  allDatasets: DatasetWithIndex[];
  setDatasets: React.Dispatch<React.SetStateAction<DatasetWithIndex[]>>;
}): React.ReactElement => {
  return (
    <div className={styles.dropdownContainer}>
      <Sort datasets={datasets} setDatasets={setDatasets} />
      <View />
      <Filter datasets={datasets} allDatasets={allDatasets} setDatasets={setDatasets} />
    </div>
  );
};



