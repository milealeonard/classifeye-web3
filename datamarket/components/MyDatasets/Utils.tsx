import React from "react";
import { Dataset } from "@/constants";

interface WindowSize {
    width: number;
    height: number;
}

export type SortType = "Ascending" | "Descending";
export type ViewType = "Gallery" | "List";
export type FilterType = "Blah" | "Bleh";


const useWindowSize = () : WindowSize  => {
    const [windowSize, setWindowSize] = React.useState<WindowSize>({
        width: window.innerWidth,
        height: window.innerHeight
    })

    React.useEffect(() => {
        const handleResize = () => {
          setWindowSize({
            width: window.innerWidth,
            height: window.innerHeight,
          });
        };
    
        window.addEventListener('resize', handleResize);
    
        // Initial call to set the state with the current window size
        handleResize();
    
        return () => {
          window.removeEventListener('resize', handleResize);
        };
      }, []);


    return windowSize;
}

/* Toggle Buttons */
const toggleSortSelect = (sortSelect: boolean) : boolean => {
    return !sortSelect;
}


const toggleViewSelect = (viewSelect: boolean) : boolean => {
    return !viewSelect;
}
const toggleFilterSelect = (filterSelect: boolean) : boolean => {
    return !filterSelect;
}


/* Dataset utils */
const sortDatasets = (datasets: Map<[Dataset, number], string[]>, option: SortType) : Map<[Dataset, number], string[]> => {
    let mapArray = Array.from(datasets.entries());

    
    if (option == "Ascending") {
        mapArray.sort((a, b) => +a[0][0].price - +b[0][0].price);
    } else if (option == "Descending") {
        mapArray.sort((a, b) => +b[0][0].price - +a[0][0].price);  
    }

    return new Map(mapArray);




}
 


export const Utils = {
    toggleSortSelect,
    toggleViewSelect,
    toggleFilterSelect,
    sortDatasets,
    useWindowSize
};



