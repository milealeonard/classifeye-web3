import React from "react";
import { ListDatasets } from "../../components/MyDatasets/ListDatasets";
import { DatasetWithIndex } from "../../constants";
import { getDataMarketContract } from "../../utils/DataContractUtils";
import { ethers } from "ethers";
import { NavBar } from "../../components/NavBar";
import { attachIndices } from "@/utils/utils";
import { LoadSpinner } from "@/components/LoadSpinner";

const MyDatasets = (): React.ReactElement => {
  const [datasetsWithIndex, setDatasetsWithIndex] = React.useState<
    DatasetWithIndex[] | undefined
  >(undefined);
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

        setDatasetsWithIndex(attachIndices(listed));
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

  if (!datasetsWithIndex || !accounts) {
    return <p>Error</p>;
  }

  return (
    <div className="flex flex-col  w-full h-screen">
      <NavBar title="My datasets" />
      <div className="flex flex-row jusifty-center items-center">
        <ListDatasets
          forOwnersOnly
          datasets={datasetsWithIndex}
          accounts={accounts}
          setDatasets={setDatasetsWithIndex}
        />
      </div>
    </div>
  );
};

export default MyDatasets;
