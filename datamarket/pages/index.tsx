import React from "react";
import { Dataset } from "../constants";
import { getDataMarketContract } from "../utils/DataContractUtils";
import { ethers } from "ethers";
import { useRouter } from "next/router";
import { Button } from "../components/Button";
import { DEFAULT_HOME_CLASSNAME } from "@/styles/theme";

const Home = (): React.ReactElement => {
  const [datasets, setDatasets] = React.useState<Dataset[] | undefined>(
    undefined
  );
  const [loading, setLoading] = React.useState(true);
  const [accounts, setAccounts] = React.useState<string[] | undefined>(
    undefined
  );

  const router = useRouter();

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
    return <p className={DEFAULT_HOME_CLASSNAME}>Loading...</p>;
  }

  if (!datasets || !accounts) {
    return (
      <p className={DEFAULT_HOME_CLASSNAME}>
        Please install or connect metamask
      </p>
    );
  }

  return (
    <div className={DEFAULT_HOME_CLASSNAME}>
      <p>Welcome!</p>
      {!!datasets.length ? (
        <Button onClick={() => router.push("/my-datasets")}>
          View your projects
        </Button>
      ) : (
        <p>You don't have any projects yet...</p>
      )}
      <Button onClick={() => router.push("/new")}>+ New</Button>
    </div>
  );
};

export default Home;
