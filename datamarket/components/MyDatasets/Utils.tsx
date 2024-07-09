import { Dataset } from "@/constants";



export type SortType = "Ascending" | "Descending";
export type ViewType = "Gallery" | "List";
export type FilterType = "Blah" | "Bleh";


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

const sortDatasets = (datasets: Dataset[], option: SortType) : Dataset[] => {
    if (option == "Ascending") {
        return [...datasets].sort((a, b) => +a.price - +b.price);
    } else if (option == "Descending") {
          return [...datasets].sort((a, b) => +b.price - +a.price);  
    }
}


export const Utils = {
    toggleSortSelect,
    toggleViewSelect,
    toggleFilterSelect,
    sortDatasets
};



