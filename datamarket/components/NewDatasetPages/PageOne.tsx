import React from "react";
import CheckIcon from "@mui/icons-material/Check";
import { ClassiFile } from "../../constants";
import { Button } from "../Button";
import { TextField } from "../TextField";
import styles from "../../pages/new/style.module.css"


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
    <div className={`${styles.container} space-y-4`} >
      <div className={styles.field}>
          <TextField
            onChange={(event) => {
              setFirstName(event.target.value);
            }}
            value={firstName}
            placeholder="Grader name"
          />

          {!!firstName && (
            <CheckIcon 
            sx={{width: 48, height: 48}}
            className="" 
            color="secondary" />
          )}
      </div>
      
      <input
        type="file"
        id="fileInput"
        onChange={handleChange}
        accept="image/*"
        multiple
        style={{ display: "none"}}
      />
        <div className={styles.fileField}>
        <button 
        className="text-2xl border-2 border-gray-400 hover:border-gray-600"
        onClick={handleButtonClick} 
        style={{minWidth: "156px", minHeight:"64px", padding: "4px", borderRadius:"6px"}}
        >Select files</button>
        {hasFiles && (
          <CheckIcon
           sx={{width: 48, height: 48}}
           color="secondary" 
           className="" />
        )}
      </div>
    </div>
  );
};

export default PageOne;
