import React from "react";
import { Dataset, DatasetVisibility } from "../../constants";
import AddIcon from '@mui/icons-material/Add';
import { DatasetView } from "./DatasetView";
import { useRouter } from "next/router";
import SettingsIcon from '@mui/icons-material/Settings';
import styles from './ListDatasets.module.css';
import ClearIcon from '@mui/icons-material/Clear';
import {SideBar} from "./SideBar";
import { Utils } from "./Utils";
import {
  decryptAndDownload,
  purchaseDataset,
  unzipFiles,
  userOwnsDataset,
  attachImagesToDataset,
} from "../../utils/utils";

export const ListDatasets = ({
  forOwnersOnly,
  datasets,
  accounts,
  liteMode,
}: {
  forOwnersOnly?: boolean;
  datasets: Dataset[];
  accounts: string[];
  liteMode?: boolean;
}): React.ReactElement => {
  const router = useRouter();
  const [sidePanelHidden, setSidePanelHidden] = React.useState(true);
  const [sortedDataSet, setDatasets] = React.useState(datasets);
  const {width, height} = Utils.useWindowSize();
  const [loading, setLoading] = React.useState(true);


  const shouldDatasetBeHidden = (dataset: Dataset): boolean => {
    return dataset.visibility === DatasetVisibility.PRIVATE && !forOwnersOnly;
  };

  const toggleSidePanel = () : void => {
    setSidePanelHidden(!sidePanelHidden);
  }

  const navToNew = (): void => {
    router.push("new");
  }


  const datasetsToBeShown = datasets.filter(
    (dataset: Dataset) => !shouldDatasetBeHidden(dataset)
  );

  // if (!datasetsToBeShown.length) {
  //   return <></>
  // }

  

  const [dsToImages, setDsToImages] = React.useState<Map<[Dataset, number], string[]>>(new Map());

  React.useEffect(() => {
    const updateImages = async () => {
      const newMap = new Map(dsToImages);
      const promises = []
      try {
        for (let i = 0; i < datasets.length; i++) {
          const ds = datasets[i];
          await attachImagesToDataset(newMap, ds, i);
          setDsToImages(newMap);
        }

      }
      catch (error){
        console.error('Error attaching images to datasets:', error);
      } 

      setLoading(false);

      console.log(loading);
    };

    if (datasets.length > 0 && datasets.length !== dsToImages.size) {
      updateImages();
    }

  }, [datasets]);


  if (loading) {

    return (
      <div className = "flex justify-center items-center h-screen w-screen">
     <div className="lds-dual-ring"></div>
    </div>
    );
  }
  
  
  return (
    <div className="flex flex-col w-full">
      <div className="flex flex-wrap justify-between w-full">
        {width > 960 && (
        <div className= {styles.add}>
          <div className="flex justify-center gap-1 border-2 border-gray-300  rounded-md p-2 content-center items-center bg-white text-black  w-add h-add mb-7 mt-2">
            <button onClick={navToNew} className={"p-2 border-2 border-red-400 rounded-full hover:bg-red-100 transition-colors duration-300 ease-in-out"}>
                <AddIcon sx={{width:"64px", height:"64px"}}/>
            </button>
          </div>
        </div>
        )}
        {width <= 960 && (
            <div className= {styles.add}>
              <button onClick={navToNew} className={"p-2 border-2 border-red-400 hover:bg-blue-300 transition-colors duration-300 ease-in-out"}>
                  <AddIcon sx={{width:"32px", height:"32px"}}/>
              </button>
          </div>
        )}
      <div className={`${styles.galleryContainer}`}>
      {Array.from(dsToImages.entries()).map((datasetAndImages: [[Dataset, number], string[]]) => {
        const dataset = datasetAndImages[0][0];
        const index = datasetAndImages[0][1];
        const imgUrls = datasetAndImages[1];
        if (shouldDatasetBeHidden(dataset)) {
          return <></>;
        }
        return (
            <div className="p-2">
            <DatasetView
              key={index}
              dataset={dataset}
              accounts={accounts}
              publicIndex={index}
              forOwnersOnly={forOwnersOnly}
              liteMode={liteMode}
              imgUrls={imgUrls}
            />
            </div>

        );
      })}
      </div>
      <div className = "flex flex-row">
        <div className={styles.rightSide}>
        {sidePanelHidden && (
          <button onClick={toggleSidePanel} style= {{height: "64px", padding: "10px", position: "absolute", top:"0", right:"0"}}>
              <SettingsIcon sx={{width: "48px", height: "48px", cursor:"pointer", marginRight: "10px"}}/>
          </button> 
        )}
          <div className={`${styles.sidepanel}  ${!sidePanelHidden ? styles.sidepanelSlide: ''}`}>
            <button onClick={toggleSidePanel} style= {{height: "48px", display: "flex", alignItems:"center", marginBottom: "10px", color: "black"}}>
                <ClearIcon sx={{width: "48px", height: "48px", cursor:"pointer"}}/>
            </button>
            <SideBar datasets={dsToImages} setDataset={setDsToImages}/>
          </div>
        </div>
      </div>
    </div>
  </div>
  );
};
