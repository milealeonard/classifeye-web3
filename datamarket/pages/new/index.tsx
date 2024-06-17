import React, { FC } from "react";
import { useRouter } from "next/router";
import { Button } from "../components/Button";
import { colors } from "@/styles/theme";
import { PageOne } from "./PageOne";
import { ClassiFile, Dataset, DatasetVisibility } from "../constants";
import { PageTwo } from "./PageTwo";
import { PageThree } from "./PageThree";
import { useSearchParams } from "next/navigation";
import JSZip from "jszip";
import { createDataset } from "../utils/utils";
import { PageFour } from "./PageFour";
import { PageFive } from "./PageFive";

const NewProj = (): React.ReactElement => {
  const router = useRouter();
  const [pageNumber, setPageNumber] = React.useState(0);

  // page one vars
  const [firstName, setFirstName] = React.useState<string>("");
  const [files, setFiles] = React.useState<ClassiFile[]>([]);

  // page two vars
  const [labels, setLabels] = React.useState<string[]>([]);

  // page four vars
  const [datasetName, setDatasetName] = React.useState<string>("");
  const [datasetDescription, setDatasetDescription] =
    React.useState<string>("");
  const [price, setPrice] = React.useState<number>(0);
  const [visibility, setVisibility] = React.useState<DatasetVisibility>(
    DatasetVisibility.PUBLIC
  );

  const [creatingDataset, setCreatingDataset] = React.useState(false);
  const [createdDataset, setCreatedDataset] = React.useState<
    Dataset | undefined
  >(undefined);

  const pageOneError = React.useMemo(() => {
    const errors: string[] = [];
    if (!firstName) {
      errors.push("a name");
    }
    if (!files.length) {
      errors.push("images");
    }
    if (errors.length === 1) {
      return `You must provide ${errors.join(",")}.`;
    }
    if (errors.length) {
      const firstMinus1 = errors.slice(0, errors.length - 1);
      const firstAfter1 = errors[errors.length - 1];
      return `You must provide ${firstMinus1.join(", ")}, and ${firstAfter1}.`;
    }
    return undefined;
  }, [files.length, firstName]);

  const pageTwoError = labels.length
    ? undefined
    : "You must provide some labels";

  const currentError =
    (pageNumber === 0 && pageOneError) || (pageNumber === 1 && pageTwoError);

  const NextButton = (
    <Button
      onClick={(): void => {
        setPageNumber((prev) => prev + 1);
      }}
      color="primary"
      disabled={!!currentError}
    >
      {pageNumber != 2 ? "Next" : "Save"}
    </Button>
  );
  const SubmitButton = (
    <Button
      onClick={async (): Promise<void> => {
        setCreatingDataset(true);
        try {
          setCreatedDataset(
            await createDataset({
              _datasetName: datasetName,
              _datasetDescription: datasetDescription,
              _datasetPrice: price,
              _datasetVisibility: visibility,
              grader: firstName,
              images: files,
            })
          );
          setPageNumber((page) => page + 1);
        } catch (error) {
          console.error(error);
        } finally {
          setCreatingDataset(false);
        }
      }}
      color="secondary"
      disabled={!!currentError || creatingDataset}
    >
      Create Dataset
    </Button>
  );

  return (
    <div
      className="flex flex-col min-h-full items-center content-center gap-2 w-6/12 pt-4"
      style={{ backgroundColor: colors.darkBlue }}
    >
      <h1>classifEye</h1>
      {pageNumber === 0 && (
        <PageOne setFiles={setFiles} setFirstName={setFirstName} />
      )}
      {pageNumber === 1 && (
        <PageTwo
          goToNextPage={(): void => setPageNumber((prev) => prev + 1)}
          labels={labels}
          setLabels={setLabels}
        />
      )}
      {pageNumber === 2 && <PageThree labels={labels} images={files} />}
      {pageNumber === 3 && (
        <PageFour
          name={datasetName}
          setName={setDatasetName}
          description={datasetDescription}
          setDescription={setDatasetDescription}
          price={price}
          setPrice={setPrice}
          visibility={visibility}
          setVisibility={setVisibility}
        />
      )}
      {pageNumber === 4 && createdDataset && (
        <PageFive dataset={createdDataset} />
      )}
      <div
        className="flex flex-row gap-4 "
        style={{
          paddingTop: pageNumber < 2 ? "30px" : undefined,
        }}
      >
        {pageNumber > 0 && pageNumber < 4 && (
          <Button
            onClick={(): void => {
              setPageNumber((prev) => prev - 1);
            }}
            color="primary"
          >
            Back
          </Button>
        )}
        {pageNumber == 4 && (
          <Button
            onClick={(): void => {
              router.push("/my-datasets");
            }}
          >
            View all
          </Button>
        )}
        {pageNumber < 3 && NextButton}
        {pageNumber === 3 && SubmitButton}
      </div>
    </div>
  );
};
export default NewProj;
