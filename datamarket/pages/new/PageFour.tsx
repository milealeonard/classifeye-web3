import React from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { ClassiFile, DatasetVisibility } from "../constants";
import { Button } from "../components/Button";
import { TextField } from "../components/TextField";
import { NumberInput } from "../components/NumberInput";

export const PageFour = ({
  name,
  setName,
  description,
  setDescription,
  price,
  setPrice,
  visibility,
  setVisibility,
}: {
  name: string;
  setName: (val: string) => void;
  description: string;
  setDescription: (val: string) => void;
  price: number | null;
  setPrice: (val: number) => void;
  visibility: DatasetVisibility;
  setVisibility: (newVis: DatasetVisibility) => void;
}): React.ReactElement => {
  const flipVisibility = (): void => {
    if (visibility === DatasetVisibility.PUBLIC) {
      setVisibility(DatasetVisibility.PRIVATE);
    } else {
      setVisibility(DatasetVisibility.PUBLIC);
    }
  };
  return (
    <div className="flex flex-col gap-1 items-center">
      <TextField
        onChange={(event): void => setName(event.target.value)}
        placeholder="Name"
        fullWidth
        value={name}
      />
      <TextField
        onChange={(event): void => setDescription(event.target.value)}
        placeholder="Description"
        fullWidth
        value={description}
        multiline
      />
      {/* TODO select sample images (or just pick first 5) */}
      <NumberInput
        placeholder="Price"
        value={price}
        onChange={(event) => setPrice(parseInt(event.target.value))}
      />
      <div className="flex flex-row gap-1">
        <p>Public</p>
        <input
          type="checkbox"
          checked={visibility === DatasetVisibility.PUBLIC}
          onClick={flipVisibility}
        />
        <input
          type="checkbox"
          checked={visibility === DatasetVisibility.PRIVATE}
          onClick={flipVisibility}
        />
        <p>Private</p>
      </div>
    </div>
  );
};
