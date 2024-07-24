import React from "react";
import { unzipFiles } from "../../utils/utils";
import { useRouter } from "next/router";
import { LoadSpinner } from "@/components/LoadSpinner";
import { Button } from "@/components/Button";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";

const ViewDataset = (): React.ReactElement => {
  const router = useRouter();
  const [imgsLoading, setImgsLoading] = React.useState(true);
  const [imgUrls, setImgUrls] = React.useState<string[] | undefined>(undefined);
  const sample = router.query.index;

  React.useEffect(() => {
    (async () => {
      try {
        console.log(sample);
        if (sample) {
          const res = await fetch(
            `https://gateway.pinata.cloud/ipfs/${sample}`
          );
          const resJson = await res.json();
          const { imgUrls: unzippedUrls } = await unzipFiles(resJson);
          setImgUrls(unzippedUrls);
        }
      } finally {
        setImgsLoading(false);
        console.log(imgUrls);
      }
    })();
  }, [sample]);

  return (
    <div className="overflow-auto flex flex-col justify-center gap-3">
      {imgsLoading && <LoadSpinner />}
      {!!imgUrls && !imgsLoading && !!imgUrls.length && (
        <div className="flex flex-col items-center gap-3">
          <p className="text-3xl"> Images: </p>
          <ImageViewer imgUrls={imgUrls} />
        </div>
      )}
    </div>
  );
};

const ImageViewer = ({
  imgUrls,
}: {
  imgUrls: string[];
}): React.ReactElement => {
  const [fileIndex, setFileIndex] = React.useState<number>(0);

  const prevImage = (): void =>
    setFileIndex((prev: number) => {
      if (prev <= 0) {
        return prev;
      }
      return prev - 1;
    });

  const nextImage = (): void => {
    // first update the file index
    let updatedIndex = null;
    setFileIndex((prev: number) => {
      if (prev >= imgUrls.length - 1) {
        return prev;
      }
      updatedIndex = prev + 1;
      return prev + 1;
    });
    if (updatedIndex === null) {
      return;
    }
  };

  return (
    <div>
      <div className="flex flex-row gap-1 content-center items-center">
        <img
          src={imgUrls[fileIndex]}
          alt="logo"
          style={{
            minHeight: 0,
            maxHeight: "calc(100vh - 480px)",
            maxWidth: "calc(100vw - 375px)",
          }}
        />
      </div>

      <p className="text-xl text-center my-4">{`Image ${fileIndex + 1}/${imgUrls.length}`}</p>
      <div className="flex flex-row items-center content-center justify-center rounded-md gap-2">
        <Button onClick={prevImage}>
          <KeyboardArrowLeftIcon />
        </Button>
        <Button onClick={nextImage}>
          <KeyboardArrowLeftIcon sx={{ transform: "rotate(180deg)" }} />
        </Button>
      </div>
    </div>
  );
};
export default ViewDataset;
