import React from "react";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";
import { ViewType } from "../../constants";
import SingleSelect from "../SingleSelect";

const View = ({
  viewOption,
  setViewOption,
}: {
  viewOption: String;
  setViewOption: React.Dispatch<React.SetStateAction<String>>;
}) => {
  const viewOptions: String[] = [ViewType.GALLERY, ViewType.LIST];
  const [viewSelect, setViewSelect] = React.useState(false);
  const toggleViewSelect = (viewSelect: boolean): boolean => {
    return !viewSelect;
  };

  return (
    <div className="flex flex-col justify-start items-center w-4/5">
      <div className="flex flex-row justify-between w-full">
        <button
          onClick={() => setViewSelect(toggleViewSelect(viewSelect))}
          className={`transform ${
            viewSelect ? "rotate-90" : "rotate-0"
          } transition-transform duration-100 ease-in-out`}
        >
          <ArrowForwardIosRoundedIcon sx={{ width: "32px", height: "32px" }} />
        </button>
        <p className="min-w-[100px]">View</p>
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
