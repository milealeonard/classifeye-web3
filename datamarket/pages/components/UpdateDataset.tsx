import React from "react";
import { Dataset, DatasetVisibility } from "../constants";

import { DatasetView } from "./DatasetView";
import { Button } from "./Button";
import { updateDataset } from "../utils/utils";
import { TextField } from "./TextField";
import { useRouter } from "next/router";
import { NumberInput } from "./NumberInput";

export const DatasetToUpdate = ({
  dataset,
  publicIndex,
}: {
  dataset: Dataset;
  publicIndex: number;
}): React.ReactElement => {
  const router = useRouter();
  const [name, setName] = React.useState(dataset.name);
  const [description, setDescription] = React.useState(dataset.description);
  const [price, setPrice] = React.useState(Number(dataset.price));
  const [visibility, setVisibility] = React.useState(dataset.visibility);

  const onUpdate = async (): Promise<void> => {
    await updateDataset({
      index: publicIndex,
      newName: name,
      newDescription: description,
      newData: dataset.data,
      newSample: dataset.sample,
      newPrice: price,
      newVisibility: visibility,
    });
    router.push("/my-datasets");
  };

  const flipVisibility = (): void => {
    if (visibility === DatasetVisibility.PUBLIC) {
      setVisibility(DatasetVisibility.PRIVATE);
    } else {
      setVisibility(DatasetVisibility.PUBLIC);
    }
  };

  return (
    // <div className="flex flex-col border rounded-md p-2 content-center items-center">
    <div className="flex flex-col items-center w-6/12 gap-4 pt-4">
      <h3>Update</h3>
      <div className="flex flex-col gap-1 items-start">
        <div className="flex flex-col gap-1 w-full">
          <p>Name:</p>
          <TextField
            onChange={(event): void => setName(event.target.value)}
            placeholder="Name"
            fullWidth
            value={name}
          />
        </div>
        <div className="flex flex-col gap-1 w-full">
          <p>Description:</p>
          <TextField
            onChange={(event): void => setDescription(event.target.value)}
            placeholder="Description"
            fullWidth
            value={description}
            multiline
          />
        </div>
        <div className="flex flex-col gap-1 w-full">
          <p>Price:</p>
          <NumberInput
            placeholder="Price"
            value={price}
            onChange={(event) => setPrice(parseInt(event.target.value))}
          />
        </div>
        <div className="flex flex-row gap-1 w-full justify-between">
          <div className="flex flex-row justify-center gap-2">
            <p>Public</p>
            <input
              type="checkbox"
              checked={visibility === DatasetVisibility.PUBLIC}
              onClick={flipVisibility}
            />
          </div>
          <div className="flex flex-row items-center gap-2">
            <input
              type="checkbox"
              checked={visibility === DatasetVisibility.PRIVATE}
              onClick={flipVisibility}
            />
            <p>Private</p>
          </div>
        </div>
      </div>
      <Button onClick={onUpdate}>Update</Button>
    </div>
  );
};
