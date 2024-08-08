import React from "react";
import { DatasetWithIndex, ViewType } from "../../constants";
import { purchaseDataset, userOwnsDataset } from "../../utils/utils";
import { useRouter } from "next/router";
import { useWindowSize } from "@/hooks/hooks";
import { GalleryView } from "./GalleryView";
import { ListView } from "./ListView";

interface DatasetViewProps {
  dataset: DatasetWithIndex;
  accounts: string[];
  // must pass in which idx this dataset has when listed via public method
  publicIndex: number | undefined;
  forOwnersOnly?: boolean;
  viewOption: string;
}

export const DatasetView = ({
  dataset,
  accounts,
  publicIndex,
  forOwnersOnly,
  viewOption,
}: DatasetViewProps): React.ReactElement => {
  const router = useRouter();
  const isOwner = userOwnsDataset(dataset, accounts);
  const shouldShowThisDataset = !forOwnersOnly || isOwner;
  const { width } = useWindowSize();

  const purchaseDatasetWrapper = async (): Promise<void> => {
    if (publicIndex === undefined) {
      console.error("Dataset does not have an index");
      return;
    }
    await purchaseDataset(publicIndex, Number(dataset.price));
  };

  if (!shouldShowThisDataset) {
    return <></>;
  }
  if (viewOption == ViewType.GALLERY) {
    return (
      <div className="p-2">
        <GalleryView
          isOwner={isOwner}
          publicIndex={publicIndex}
          dataset={dataset}
          accounts={accounts}
        />
      </div>
    );
  }
  return (
    <ListView
      isOwner={isOwner}
      publicIndex={publicIndex}
      dataset={dataset}
      accounts={accounts}
    />
  );
};
