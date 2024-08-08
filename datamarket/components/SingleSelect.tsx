import React from "react";

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
    <div className="flex flex-col items-start w-[85%]">
      {selected && (
        <div className="min-w-full">
          {list.map((opt) => (
            <button
              key={String(opt)}
              onClick={() => changeOption(opt)}
              className="flex flex-row items-center w-full text-left py-2"
            >
              <span
                className={`flex items-center mr-[10px] min-h-[28px] cursor-pointer ${
                  opt === option
                    ? "text-[18.2px] text-lightcoral"
                    : "text-[16px]"
                }`}
              >
                {opt === option ? "●" : "○"}
              </span>
              <p className="text-base">{String(opt)}</p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SingleSelect;
