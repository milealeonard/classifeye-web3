import React from "react";
import { useRouter } from "next/router";
import { Dataset } from "../constants";
import { getDataMarketContract } from "../utils/DataContractUtils";
import { ethers } from "ethers";
import { DatasetToUpdate } from "../components/UpdateDataset";
import { userOwnsDataset } from "../utils/utils";

const UpdateDatasets = (): React.ReactElement => {
  const router = useRouter();

  const [datasets, setDatasets] = React.useState<Dataset[] | undefined>(
    undefined
  );
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

        const signerHere = await provider.getSigner();
        const dataMarketContract = getDataMarketContract(signerHere);
        const listed = await dataMarketContract.listAllDatasets();

        setDatasets(listed);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  console.log(accounts);

  if (loading) {
    return <p>Loading...</p>;
  }

  const publicIndex = router.query.index;

  if (typeof publicIndex != "string") {
    return <p>Error</p>;
  }

  const selectedDataset = datasets[publicIndex];

  if (!userOwnsDataset(selectedDataset, accounts)) {
    return <p>You do not own this dataset</p>;
  }

  return (
    <DatasetToUpdate
      dataset={selectedDataset}
      publicIndex={parseInt(publicIndex)}
    />
  );
};
export default UpdateDatasets;
