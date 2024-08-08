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
    <div className="flex flex-col gap-1 space-y-4 items-center">
      <div className="flex justify-between border-b-2 border-gray-500 w-[30vw] bg-[#F0F4F8] pt-[2px]">
        <TextField
          onChange={(event): void => setName(event.target.value)}
          placeholder="Name"
          fullWidth
          value={name}
          textSize="text-3xl"
        />
      </div>
      <div className="flex justify-between border-b-2 border-gray-500 w-[30vw] bg-[#F0F4F8] pt-[2px]">
        <TextField
          onChange={(event): void => setDescription(event.target.value)}
          placeholder="Description"
          fullWidth
          value={description}
          textSize="text-3xl"
        />
      </div>
      {/* TODO select sample images (or just pick first 5) */}
      <div className="pt-2 w-full">
        <NumberInput
          placeholder="Price ($)"
          value={price}
          onChange={(event) => setPrice(parseInt(event.target.value))}
        />
      </div>
      <div className="flex flex-row w-full justify-between items-center gap-1 text-3xl">
        <div className="flex flex-row items-center">
          <p>Public</p>
          <div className="pl-4 mt-2">
            <input
              type="checkbox"
              checked={visibility === DatasetVisibility.PUBLIC}
              onClick={flipVisibility}
              className="w-6 h-6 transition-transform transform scale-75"
            />
          </div>
        </div>
        <div className="flex flex-row items-center">
          <div className="pr-4 mt-2">
            <input
              type="checkbox"
              checked={visibility === DatasetVisibility.PRIVATE}
              onClick={flipVisibility}
              className="w-6 h-6 transition-transform transform scale-75"
            />
          </div>
          <p>Private</p>
        </div>
      </div>
    </div>
  );
};
