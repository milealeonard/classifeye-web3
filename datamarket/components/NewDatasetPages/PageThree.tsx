import React from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { ClassiFile } from "../../constants";
import { Button } from "../Button";
import { TextField } from "../TextField";
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import { getShowableIndex } from "../../utils/utils";

const PageThree = ({
  labels,
  images,
}: {
  labels: string[];
  images: ClassiFile[];
}): React.ReactElement => {
  // state
  const [fileIndex, setFileIndex] = React.useState<number>(0);

  const [hackyIndex, setHackyIndex] = React.useState(0);

  const currClassif = React.useMemo(() => {
    return images[fileIndex].classif ?? "";
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fileIndex, images, hackyIndex]);

  const setCurrClassif = (text: string): void => {
    if (!text) {
      images[fileIndex].classif = undefined;
    }
    const prevClassif = images[fileIndex].classif;
    if (prevClassif.includes(text)) {
      return;
    }
    if (prevClassif) {
      images[fileIndex].classif = prevClassif + `, ${text}`;
    } else {
      images[fileIndex].classif = text;
    }
    setHackyIndex((prev) => prev + 1);
  };

  // callbacks
  const nextImage = (): void => {
    // first update the file index
    let updatedIndex = null;
    setFileIndex((prev: number) => {
      if (prev >= images.length - 1) {
        return prev;
      }
      updatedIndex = prev + 1;
      return prev + 1;
    });
    if (updatedIndex === null) {
      return;
    }
  };

  const prevImage = (): void =>
    setFileIndex((prev: number) => {
      if (prev <= 0) {
        return prev;
      }
      return prev - 1;
    });

  // derived
  const indicesToLabels = React.useMemo(() => {
    const record = new Map<string, string>([]);
    for (let i = 0; i < labels.length; i++) {
      const showableIndex = getShowableIndex(i);
      if (showableIndex === undefined) {
        break;
      }
      record.set(showableIndex, labels[i]);
    }
    return record;
  }, [labels]);

  // hotkeys
  useHotkeys("ArrowRight", () => {
    nextImage();
  });
  useHotkeys("ArrowLeft", () => {
    prevImage();
  });

  useHotkeys("*", (event) => {
    console.log(indicesToLabels.has(event.key));
    if (!indicesToLabels.has(event.key)) {
      return;
    }
    setCurrClassif(indicesToLabels.get(event.key)!);
  });

  if (!images.length) {
    return <p>Error</p>;
  }

  return (
    <div
      className="flex flex-col gap-1"
      style={{ width: "50vw", alignItems: "center" }}
    >
      <div
        className="flex flex-col gap-2"
        style={{
          position: "absolute",
          left: "10%",
          width: "16.5vw",
          alignItems: "center",
          justifyContent: "center",
          height: "calc(70vh - 150px)",
          overflow: "auto",
        }}
      >
        {labels.map((label: string, index: number) => {
          const indexToShow = getShowableIndex(index);
          return (
            <div
              onClick={(): void => {
                if (!indexToShow) {
                  return;
                }
                setCurrClassif(label);
              }}
              key={label}
              style={{
                minWidth: "13vw",
                display: "block",
                padding: "4px",
                borderRadius: "4px",
              }}
            >
              <p className="text-3xl font-bold">
                {indexToShow ? `${indexToShow}: ${label}` : "Too many labels"}
              </p>
            </div>
          );
        })}
      </div>
      <div
        className="flex flex-row gap-1 content-center items-center"
        // style={{
        //   height: "calc(100vh - 330px)",
        // }}
      >
        <img
          src={images[fileIndex].content}
          alt="logo"
          style={{
            minHeight: 0,
            maxHeight: "calc(100vh - 480px)",
            maxWidth: "calc(100vw - 375px)",
          }}
        />
      </div>

      <p className="text-xl">{`Image ${fileIndex + 1}/${images.length}`}</p>
      <div className="flex flex-row items-center content-center rounded-md gap-2">
        <Button onClick={prevImage}>
          <KeyboardArrowLeftIcon />
        </Button>
        <Button onClick={nextImage}>
          <KeyboardArrowLeftIcon sx={{ transform: "rotate(180deg)" }} />
        </Button>
      </div>
      <div className="flex flex-row gap-2">
        <TextField
          onChange={(event) => {
            setCurrClassif(event.target.value ?? "");
          }}
          value={currClassif}
          placeholder="Classif"
        />
        <Button onClick={(): void => setCurrClassif("")}>Clear</Button>
      </div>
    </div>
  );
};

export default PageThree;
