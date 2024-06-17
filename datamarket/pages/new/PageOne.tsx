import React from "react";
import { ClassiFile } from "../constants";
import { Button } from "../components/Button";
import { TextField } from "../components/TextField";

export const PageOne = ({
  setFiles,
  setFirstName,
}: {
  setFiles: (prop: ClassiFile[]) => void;
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
      <TextField
        onChange={(event) => {
          setFirstName(event.target.value);
        }}
        placeholder="Grader name"
      />
      <input
        type="file"
        id="fileInput"
        onChange={handleChange}
        accept="image/*"
        multiple
        style={{ display: "none" }}
      />
      <div className="flex flex-row content-between items-center">
        <Button onClick={handleButtonClick}>Select files</Button>
        {/* {hasFiles && <CheckIcon color="secondary" />} */}
      </div>
    </div>
  );
};
