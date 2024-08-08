import React from "react";
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
    <div className="flex flex-col justify-start items-center w-4/5">
      <div className="flex flex-row justify-between w-full">
        <button
          onClick={() => setFilterSelect(toggleFilterSelect(filterSelect))}
          className={`transform ${
            filterSelect ? "rotate-90" : "rotate-0"
          } transition-transform duration-100 ease-in-out`}
        >
          <ArrowForwardIosRoundedIcon sx={{ width: "32px", height: "32px" }} />
        </button>
        <p className="min-w-[100px]">Filter</p>
      </div>
      {filterSelect && (
        <div className="flex flex-col items-start w-10/12">
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
