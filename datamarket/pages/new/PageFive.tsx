import React from "react";
import { Dataset } from "../constants";
import { DatasetView } from "../components/DatasetView";
import { ethers } from "ethers";

export const PageFive = ({
  dataset,
}: {
  dataset: Dataset;
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
    return <p>Loading...</p>;
  }

  console.log(dataset);

  return (
    <div className="flex flex-col gap-1">
      <p>
        Please wait while your dataset gets created. It can take up to a few
        minutes.
      </p>
      <DatasetView
        dataset={dataset}
        accounts={accounts}
        publicIndex={undefined}
      />
    </div>
  );
};
