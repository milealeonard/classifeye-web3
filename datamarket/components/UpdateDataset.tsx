import React from "react";
import { Dataset } from "../constants";

import { Button } from "./Button";
import { updateDataset } from "../utils/utils";

import { useRouter } from "next/router";

import toast from "react-hot-toast";
import { UpdateOrCreateDataset } from "./UpdateOrCreateDataset";

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
    try {
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
    } catch (error) {
      toast.error("Failed to update dataset...");
    }
  };

  return (
    <div className="flex flex-col items-center w-6/12 gap-4 pt-4">
      <h3>Update</h3>
      <UpdateOrCreateDataset
        name={name}
        setName={setName}
        description={description}
        setDescription={setDescription}
        price={price}
        setPrice={setPrice}
        visibility={visibility}
        setVisibility={setVisibility}
      />
      <Button onClick={onUpdate}>Update</Button>
    </div>
  );
};
