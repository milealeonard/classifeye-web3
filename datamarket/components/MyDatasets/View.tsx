import React from "react";
import styles from "./MyDatasets.module.css";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";
import { ViewType } from "../../constants";
import SingleSelect from "../SingleSelect";

const View = ({
  viewOption,
  setViewOption,
}: {
  viewOption: ViewType,
  setViewOption: React.Dispatch<React.SetStateAction<ViewType>>
}) => {
  const viewOptions: ViewType[] = ["Gallery", "List"];
  const [viewSelect, setViewSelect] = React.useState(false);
  const toggleViewSelect = (viewSelect: boolean): boolean => {
    return !viewSelect;
  };

  return (
    <div className={styles.dropdown}>
      <div className={styles.dropdownCategories}>
        <button
          onClick={() => setViewSelect(toggleViewSelect(viewSelect))}
          className={`${styles.rotateDrop} ${
            viewSelect ? styles.rotateDropdown : ""
          }`}
        >
          <ArrowForwardIosRoundedIcon
            sx={{ width: "32px", height: "32px" }}
            className={styles.dropBtn}
          />
        </button>
        <p>View</p>
      </div>
      <SingleSelect
        list={viewOptions}
        selected={viewSelect}
        option={viewOption}
        changeOption={setViewOption}
      />
    </div>
  );
};

export default View;
