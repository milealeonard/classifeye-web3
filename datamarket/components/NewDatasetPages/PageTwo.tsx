import React from "react";
import { Button } from "../Button";
import { TextField } from "../TextField";

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
    <Button
      onClick={(): void => {
        addNewLabelCallback();
      }}
      disabled={tooManyLabels}
    >
      Add
    </Button>
  );

  return (
    <div className="gap-1 flex flex-col items-center" style={{ width: "50vw" }}>
      <div
        className="flex flex-row gap-1"
        style={{
          position: "relative",
          left: "30px",
          paddingBottom: labels.length ? "30px" : undefined,
        }}
      >
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
        />
        {tooManyLabels ? (
          <div className="flex content-center items-center">{AddButton}</div>
        ) : (
          AddButton
        )}
      </div>
      {!!labels.length && (
        <div
          className="flex flex-col items-end gap-2 rounded-md p-1"
          style={{
            maxHeight: "50vh",
            overflow: "auto",
          }}
        >
          {labels.map((value: string) => {
            return (
              <div className="flex flex-row gap-2 items-center" key={value}>
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
