import React from "react";
import CheckIcon from "@mui/icons-material/Check";
import { ClassiFile } from "../../constants";
import { Button } from "../Button";
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
    <div className="flex flex-col gap-3 items-center" style={{ width: "50vw" }}>
      <div className="flex flex-row gap-1 items-center relative">
        <TextField
          onChange={(event) => {
            setFirstName(event.target.value);
          }}
          value={firstName}
          placeholder="Grader name"
        />

        {!!firstName && (
          <CheckIcon className="absolute -right-8" color="secondary" />
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
      <div className="flex flex-row content-between items-center relative">
        <Button onClick={handleButtonClick}>Select files</Button>
        {hasFiles && (
          <CheckIcon color="secondary" className="absolute -right-8" />
        )}
      </div>
    </div>
  );
};

export default PageOne;
