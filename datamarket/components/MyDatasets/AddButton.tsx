import React from "react";
import AddIcon from "@mui/icons-material/Add";
import { useRouter } from "next/router";
import { useWindowSize } from "@/hooks/hooks";

const AddButton = () => {
  const router = useRouter();
  const navToNew = (): void => {
    router.push("new");
  };

  const { width } = useWindowSize();
  if (width > 960) {
    return (
      <div className="flex flex-col items-center fixed left-0 top-belowNav">
        <div className="flex justify-center gap-1 border-2 border-gray-300  rounded-md p-2 content-center items-center bg-white text-black  w-add h-add m-4">
          <button
            onClick={navToNew}
            className={
              "p-2 border-2 border-red-400 rounded-full hover:bg-red-100 transition-colors duration-300 ease-in-out"
            }
          >
            <AddIcon sx={{ width: "64px", height: "64px" }} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center fixed left-0 top-belowNav">
      <button
        onClick={navToNew}
        className={
          "p-2 border-2 border-red-400 hover:bg-blue-300 transition-colors duration-300 ease-in-out"
        }
      >
        <AddIcon sx={{ width: "32px", height: "32px" }} />
      </button>
    </div>
  );
};

export default AddButton;
