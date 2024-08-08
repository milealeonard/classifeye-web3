import React from "react";
import { DatasetWithIndex } from "../../constants";
import { ViewType } from "../../constants";

export const DatasetDetails = ({
  dataset,
  showDescription,
  viewType,
}: {
  dataset: DatasetWithIndex;
  showDescription: boolean;
  viewType: ViewType;
}) => {
  if (viewType == ViewType.LIST) {
    return (
      <div className="flex flex-wrap justify-between content-center w-1/2">
        <p className="w-1/4 font-bold content-center">{dataset.name}</p>
        {showDescription && (
          <p className="w-1/4 content-center">{dataset.description}</p>
        )}
        <p className="w-1/4 italic content-center">
          ${dataset.price.toString()}
        </p>
      </div>
    );
  } else {
    return (
      <div>
        <div className="flex flex-col gap-1 items-center">
          <h3>{dataset.name}</h3>
          <p>{dataset.description}</p>
        </div>
        <div className="flex flex-col gap-1 items-center">
          <p>Price: ${dataset.price.toString()}</p>
        </div>
      </div>
    );
  }
};
