import React from "react";
import { ClassiFile, Dataset } from "../constants";
import { getDataMarketContract } from "../utils/DataContractUtils";
import { ethers } from "ethers";
import { DEFAULT_HOME_CLASSNAME } from "@/styles/theme";
import {
  decryptAndView,
  encryptAndZipData,
  parseLabelsFromClassifile,
  updateDataset,
  userOwnsDataset,
} from "../utils/utils";
import { useRouter } from "next/router";
import { PageThree } from "../new/PageThree";
import { Button } from "../components/Button";

const ResumeMarking = (): React.ReactElement => {
  const router = useRouter();

  const [imgs, setImgs] = React.useState<ClassiFile[] | undefined>(undefined);
  const [loading, setLoading] = React.useState(true);
  const [accounts, setAccounts] = React.useState<string[] | undefined>(
    undefined
  );
  const [selectedDataset, setSelectedDataset] = React.useState<
    Dataset | undefined
  >(undefined);
  const [error, setError] = React.useState<string | undefined>(undefined);
  const publicIndex =
    typeof router.query.index === "string"
      ? parseInt(router.query.index)
      : undefined;

  React.useEffect(() => {
    (async () => {
      try {
        // @ts-ignore
        const provider = new ethers.providers.Web3Provider(window.ethereum);

        const tempAccounts = await provider.send("eth_requestAccounts", []);
        setAccounts(tempAccounts);

        const signerHere = await provider.getSigner();
        const dataMarketContract = getDataMarketContract(signerHere);
        const listed = await dataMarketContract.listAllDatasets();
        if (listed.length < publicIndex) {
          setError("dataset doesn't exist");
          return;
        }
        const currSelectedDataset = listed[publicIndex];
        setSelectedDataset(currSelectedDataset);
        if (
          !currSelectedDataset ||
          !userOwnsDataset(currSelectedDataset, tempAccounts)
        ) {
          setError("You do not own this dataset");
          return;
        }

        // then we want to decrypt the thing
        const { files: tempFiles } = await decryptAndView({
          cid: currSelectedDataset.data,
          account: tempAccounts[0],
        });
        setImgs(tempFiles);
        // parse the CSV classifs
        // build our img objects
        // go to earliest not labelled img
      } catch (e) {
        console.error(e);
      } finally {
        if (publicIndex !== undefined) {
          setLoading(false);
        }
      }
    })();
  }, [publicIndex]);

  const onSave = async (): Promise<void> => {
    if (!imgs.length || !selectedDataset) {
      return;
    }
    const graders = imgs
      .filter((img: ClassiFile) => !!img.grader)
      .map((img: ClassiFile) => img.grader);
    if (!graders.length) {
      return;
    }
    const { data: createdDatasetCid } = await encryptAndZipData({
      grader: graders[0],
      images: imgs,
    });
    await updateDataset({
      index: publicIndex,
      newName: selectedDataset.name,
      newDescription: selectedDataset.description,
      newData: createdDatasetCid,
      newSample: selectedDataset.sample,
      newPrice: Number(selectedDataset.price),
      newVisibility: selectedDataset.visibility,
    });
  };

  if (loading) {
    return <p className={DEFAULT_HOME_CLASSNAME}>Loading...</p>;
  }

  if (!imgs || !accounts?.length) {
    return <p className={DEFAULT_HOME_CLASSNAME}>Error</p>;
  }

  return (
    <>
      <PageThree labels={parseLabelsFromClassifile(imgs)} images={imgs} />
      <Button onClick={onSave} color="primary">
        Save
      </Button>
    </>
  );
};

export default ResumeMarking;
