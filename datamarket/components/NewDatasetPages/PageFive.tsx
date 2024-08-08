import React from "react";
import { Dataset, DatasetWithIndex } from "../../constants";
import { DatasetView } from "../MyDatasets/DatasetView";
import { ethers } from "ethers";
import { LoadSpinner } from "../LoadSpinner";
import { ViewType } from "../../constants";

const PageFive = ({
  dataset,
}: {
  dataset: DatasetWithIndex;
}): React.ReactElement => {
  const [loading, setLoading] = React.useState(true);
  const [accounts, setAccounts] = React.useState<string[] | undefined>(
    undefined
  );
  React.useEffect(() => {
    (async () => {
      try {
        // @ts-ignore
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        setAccounts(await provider.send("eth_requestAccounts", []));
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return <LoadSpinner />;
  }

  console.log(dataset);

  return (
    <div className="flex flex-col gap-1">
      <div className="text-center text-2xl">
        Please wait while your dataset gets created. It can take up to a few
        minutes.
      </div>
      <DatasetView
        dataset={dataset}
        accounts={accounts}
        publicIndex={undefined}
        viewOption={ViewType.GALLERY}
      />
    </div>
  );
};

export default PageFive;
