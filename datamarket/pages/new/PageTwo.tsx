import React from "react";
import { Button } from "../components/Button";
import { TextField } from "../components/TextField";

const MAX_LABELS = 26;

export const PageTwo = ({
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
          //   <Tooltip
          //     title="You have reached the maximum number of labels"
          //     placement="right"
          //   >
          <div className="flex content-center items-center">{AddButton}</div>
        ) : (
          //   </Tooltip>
          AddButton
        )}
      </div>
      {!!labels.length && (
        <div
          className="flex flex-col items-end gap-2 rounded-md p-1"
          style={{
            maxHeight: "50vh",
            overflow: "auto",
            // border: "1px solid rgba(255, 255, 255, 0.1)",
          }}
        >
          {labels.map((value: string) => {
            return (
              <div className="flex flex-row gap-2 items-center" key={value}>
                {/* <Typography
                  component="span"
                  variant="body1"
                  paddingBottom="3px"
                > */}
                <p>{value}</p>
                {/* </Typography> */}
                <Button
                  onClick={(): void => {
                    // @ts-ignore
                    setLabels((prev) =>
                      prev.filter((currVal: string) => currVal !== value)
                    );
                  }}
                >
                  {/* <Typography
                    component="span"
                    variant="body2"
                    color={muiXTheme.palette.primary.main}
                  > */}
                  <p>Delete</p>
                  {/* </Typography> */}
                </Button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
