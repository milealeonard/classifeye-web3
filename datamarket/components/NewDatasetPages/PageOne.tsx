import React from "react";
import CheckIcon from "@mui/icons-material/Check";
import { ClassiFile } from "../../constants";
import { TextField } from "../TextField";
const PageOne = ({
  hasFiles,
  setFiles,
  firstName,
  setFirstName,
}: {
  hasFiles: boolean;
  setFiles: (prop: ClassiFile[]) => void;
  firstName: string;
  setFirstName: (name: string) => void;
}): React.ReactElement => {
  function handleChange(e: any) {
    const returnval = [];
    for (let i = 0; i < e.target.files.length; i++) {
      returnval.push({
        blobby: e.target.files[i],
        content: URL.createObjectURL(e.target.files[i]),
        name: e.target.files[i].name,
        classif: undefined,
      });
    }
    setFiles(returnval);
  }
  function handleButtonClick() {
    // Trigger a click event on the hidden file input
    const fileInput = document.getElementById("fileInput");
    if (fileInput) {
      fileInput.click();
    }
  }

  return (
    <div className="flex flex-col items-center justify-center gap-[3px] w-[50vw] space-y-4">
      <div className="flex justify-between border-b-2 border-gray-500 w-[30vw] bg-[#F0F4F8] pt-[2px]">
        <TextField
          onChange={(event) => {
            setFirstName(event.target.value);
          }}
          value={firstName}
          placeholder="Grader name"
          textSize="text-3xl"
        />

        {!!firstName && (
          <CheckIcon
            sx={{ width: 48, height: 48 }}
            className=""
            color="secondary"
          />
        )}
      </div>

      <input
        type="file"
        id="fileInput"
        onChange={handleChange}
        accept="image/*"
        multiple
        style={{ display: "none" }}
      />
      <div className="flex justify-between w-[30vw] mt-2 hover:border-black">
        <button
          className="text-2xl border-2 border-gray-400 hover:border-gray-600"
          onClick={handleButtonClick}
          style={{
            minWidth: "156px",
            minHeight: "64px",
            padding: "4px",
            borderRadius: "6px",
          }}
        >
          Select files
        </button>
        {hasFiles && (
          <CheckIcon
            sx={{ width: 48, height: 48 }}
            color="secondary"
            className=""
          />
        )}
      </div>
    </div>
  );
};

export default PageOne;
