import React from "react";
import { Dataset } from "../constants";
import { getDataMarketContract } from "../utils/DataContractUtils";
import { ethers } from "ethers";
import { useRouter } from "next/router";
import { DEFAULT_HOME_CLASSNAME } from "@/styles/theme";
import { NavBar } from "@/components/NavBar";
import styles from "./homeStyle.module.css";
import { LoadSpinner } from "@/components/LoadSpinner";
import { useWindowSize } from "@/hooks/hooks";

const Home = (): React.ReactElement => {
  const [datasets, setDatasets] = React.useState<Dataset[] | undefined>(
    undefined
  );
  const [loading, setLoading] = React.useState(true);
  const [accounts, setAccounts] = React.useState<string[] | undefined>(
    undefined
  );
  const {width} = useWindowSize();

  let buttonLayout = "flex flex-row h-3/6 space-x-36 h-3/6 mt-24"
  if (width < 970) {
    buttonLayout = "flex flex-col justify-between h-3/6 space-y-4 mt-24"
  }

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
    return <LoadSpinner />;
  }

  if (!datasets || !accounts) {
    return (
      <p className={styles.metamask}>
        Please install or connect
        <a
          className={styles.metamaskLink}
          href="https://chromewebstore.google.com/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn"
          target="_blank"
        >
          {" "}
          metamask
        </a>
      </p>
    );
  }

  return (
    <div className={DEFAULT_HOME_CLASSNAME}>
      <NavBar title="Home" />
      <div className="flex flex-col justify-center items-center w-screen h-5/6">
        <div className = {buttonLayout}>
          {!!datasets.length && <ViewProjects />}
          <NewDataset />
        </div>
      </div>
    </div>
  );
};

const ViewProjects = () => {
  const router = useRouter();
  return (
    <div
      className="text-center text-3xl border-2 border-red-300 rounded-md hover:bg-red-100 transition-colors duration-300 ease-in-out"
      style={{ minWidth: "400px", minHeight:"50%" }}
    >
      <button
        onClick={() => router.push("/my-datasets")}
        className="h-full w-full"
      >
        <div className="flex flex-col justify-center h-full  hover:scale-110 transition-transform duration-300">
          View your projects
        </div>
      </button>
    </div>
  );
};

const NewDataset = () => {
  const router = useRouter();
  return (
    <div
      className="text-center text-3xl border-2 border-red-300 rounded-md hover:bg-red-100 transition-colors duration-300 ease-in-out"
      style={{ minWidth: "400px",minHeight:"50%"}}
    >
      <button onClick={() => router.push("/new")} className="h-full w-full">
        <div className="flex flex-col justify-center h-full hover:scale-110 transition-transform duration-300">
          + New
        </div>
      </button>
    </div>
  );
};
export default Home;
