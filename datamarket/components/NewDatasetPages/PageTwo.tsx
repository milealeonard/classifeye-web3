import React from "react";
import { Button } from "../Button";
import { TextField } from "../TextField";
import styles from "../../pages/new/style.module.css"

const MAX_LABELS = 26;

const PageTwo = ({
  goToNextPage,
  labels,
  setLabels,
}: {
  goToNextPage: () => void;
  labels: string[];
  setLabels: (labels: string[]) => void;
}): React.ReactElement => {
  const [currText, setCurrText] = React.useState<string>("");

  const addNewLabelCallback = (): void => {
    if (currText.length === 0 && labels.length) {
      goToNextPage();
      return;
    }
    if (!labels.includes(currText)) {
      // @ts-ignore
      setLabels((prev) => [...prev, currText]);
    }
    setCurrText("");
  };

  const tooManyLabels = labels.length >= MAX_LABELS;

  const AddButton = (
    <div 
    className = "w-full pt-8">
    <button
      onClick={(): void => {
        addNewLabelCallback();
      }}
      disabled={tooManyLabels}
      className="w-full border-2 border-gray-400 py-2 rounded-md text-3xl hover:border-gray-700"
    >
      Add
    </button>
    </div>
  );

  return (
    <div className="gap-1 flex flex-col items-center">
      <div className="flex flex-col items-center">
        <div className={styles.field}>
          <TextField
            value={currText}
            onKeyDown={(event): void => {
              if (event.code !== "Enter") {
                return;
              }
              addNewLabelCallback();
            }}
            onChange={(event): void => {
              setCurrText(event.target.value ?? "");
            }}
            placeholder="Add a label"
            textSize="text-3xl"
          />
          </div>
        {tooManyLabels ? (
          <div className="flex content-center items-center">{AddButton}</div>
        ) : (
          AddButton
        )}
    
      </div>
      {!!labels.length && (
        <div
          className="flex flex-col items-end gap-1 rounded-md"
          style={{
            maxHeight: "50vh",
            overflow: "auto",
          }}
        >
          {labels.map((value: string) => {
            return (
              <div className="flex flex-row gap-2 items-center text-3xl" key={value}>
                <p>{value}</p>
                <Button
                  removeOutline
                  onClick={(): void => {
                    // @ts-ignore
                    setLabels((prev) =>
                      prev.filter((currVal: string) => currVal !== value)
                    );
                  }}
                >
                  <p>Delete</p>
                </Button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default PageTwo;
