import React from "react";
import { useRouter } from "next/router";
import { Button } from "../../components/Button";
import { colors } from "@/styles/theme";
import PageOne from "../../components/NewDatasetPages/PageOne";
import {
  ClassiFile,
  DatasetWithIndex,
  DatasetVisibility,
} from "../../constants";
import PageTwo from "../../components/NewDatasetPages/PageTwo";
import PageThree from "../../components/NewDatasetPages/PageThree";
import { createDataset } from "../../utils/utils";
import PageFour from "../../components/NewDatasetPages/PageFour";
import PageFive from "../../components/NewDatasetPages/PageFive";
import toast from "react-hot-toast";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import LibraryAddIcon from "@mui/icons-material/LibraryAdd";
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
  const [price, setPrice] = React.useState<number | "">("");
  const [visibility, setVisibility] = React.useState<DatasetVisibility>(
    DatasetVisibility.PUBLIC
  );

  const [creatingDataset, setCreatingDataset] = React.useState(false);
  const [createdDataset, setCreatedDataset] = React.useState<
    DatasetWithIndex | undefined
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

  const PrevButton = (
    <button
      onClick={(): void => {
        setPageNumber((prev) => prev - 1);
      }}
      className="border-2 border-red-300 rounded-md p-2 disabled:text-gray-500 disabled:border-gray-500 disabled:bg-lightGray hover:bg-red-100"
      disabled={pageNumber == 0}
    >
      <ArrowBackIcon sx={{ width: 64, height: 64 }} />
    </button>
  );
  const NextButton = (
    <button
      onClick={(): void => {
        setPageNumber((prev) => prev + 1);
      }}
      className="border-2 border-red-300 rounded-md p-2 disabled:text-gray-500 disabled:border-gray-500 disabled:bg-lightGray hover:bg-red-100"
      disabled={!!currentError}
    >
      {/* {pageNumber != 2 ? "Next" : "Save"} */}
      <ArrowForwardIcon sx={{ width: 64, height: 64 }} />
    </button>
  );
  const SubmitButton = (
    <button
      onClick={async (): Promise<void> => {
        setCreatingDataset(true);
        try {
          setCreatedDataset(
            await createDataset({
              _datasetName: datasetName,
              _datasetDescription: datasetDescription,
              _datasetPrice: price || 0,
              _datasetVisibility: visibility,
              grader: firstName,
              images: files,
            })
          );
          setPageNumber((page) => page + 1);
        } catch (error) {
          console.error(error);
          toast.error("Failed to create dataset...");
        } finally {
          setCreatingDataset(false);
        }
      }}
      className="border-2 border-red-300 p-2 rounded-md text-3xl hover:bg-red-100"
      disabled={!!currentError || creatingDataset}
    >
      Create
    </button>
  );

  return (
    <div
      className="flex flex-col min-h-full items-center content-center gap-2 w-6/12 pt-4"
      style={{ backgroundColor: colors.lightGray }}
    >
      <h1 className="pb-12">New Project</h1>
      {pageNumber === 0 && (
        <PageOne
          hasFiles={!!files.length}
          setFiles={setFiles}
          firstName={firstName}
          setFirstName={setFirstName}
        />
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
      <div className="flex flex-row pt-6 w-full justify-center">
        {pageNumber != 4 && (
          <div
            className="flex flex-row justify-between"
            style={{ width: "30vw" }}
          >
            {pageNumber <= 3 && PrevButton}
            {pageNumber < 3 && NextButton}
            {pageNumber === 3 && SubmitButton}
          </div>
        )}
        {pageNumber == 4 && (
          <button
            onClick={(): void => {
              router.push("/my-datasets");
            }}
            className="border-2 border-red-300 text-3xl p-6 rounded-md hover:bg-red-100"
          >
            View all
          </button>
        )}
      </div>
    </div>
  );
};
export default NewProj;
