import React from "react";
import { ListDatasets } from "../../components/MyDatasets/ListDatasets";
import { Dataset } from "../../constants";
import { getDataMarketContract } from "../../utils/DataContractUtils";
import { ethers } from "ethers";
import { NavBar } from "../../components/NavBar";

const Home = (): React.ReactElement => {
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

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!datasets || !accounts) {
    return <p>Error</p>;
  }

  return (
    <div className="flex flex-col items-center w-full gap-4 h-screen">
      <NavBar title="Datasets" />
      <div>
        <ListDatasets datasets={datasets} accounts={accounts} />
      </div>
    </div>
  );
};

export default Home;
