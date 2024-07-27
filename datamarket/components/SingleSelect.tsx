import React from "react";
import styles from "./MyDatasets/MyDatasets.module.css";

const SingleSelect = <T,>({
  list,
  selected,
  option,

  changeOption,
}: {
  list: T[];
  selected: boolean;
  option: T;
  changeOption: (option: T) => void;
}) => {
  return (
    <div className={styles.dropdownOptions}>
      {selected && (
        <div className="min-w-full">
          {list.map((opt) => (
            <button
              key={String(opt)}
              onClick={() => changeOption(opt)}
              className={`${styles.selectOption} ${
                opt === option ? styles.selected : ""
              }`}
            >
              {String(opt).slice(0)}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SingleSelect;
