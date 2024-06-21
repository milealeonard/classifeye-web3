import React from "react";
import { DatasetVisibility, UpdateOrCreateDatasetProps } from "../constants";

import { TextField } from "./TextField";
import { NumberInput } from "./NumberInput";

export const UpdateOrCreateDataset = ({
  name,
  setName,
  description,
  setDescription,
  price,
  setPrice,
  visibility,
  setVisibility,
}: UpdateOrCreateDatasetProps): React.ReactElement => {
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
      <div className="flex flex-row items-center justify-center gap-1">
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
