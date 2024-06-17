import React from "react";

import { UpdateOrCreateDatasetProps } from "../constants";
import { UpdateOrCreateDataset } from "../components/UpdateOrCreateDataset";

/**
 * Don't actually need this to be its own page, but just for consistency so we can name it PageFour in the series of pages
 */
export const PageFour = ({
  name,
  setName,
  description,
  setDescription,
  price,
  setPrice,
  visibility,
  setVisibility,
}: UpdateOrCreateDatasetProps): React.ReactElement => {
  return (
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
  );
};
