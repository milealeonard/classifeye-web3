import React from "react";
import { Dataset } from "../../constants";
import styles from './ListDatasets.module.css';
import ArrowForwardIosRoundedIcon from '@mui/icons-material/ArrowForwardIosRounded';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import {Utils} from './Utils'
import { SortType, ViewType, FilterType } from "./Utils";
import { filter } from "jszip";



export const SideBar = (
    {datasets, setDataset}: 
    {datasets: Dataset[], setDataset: React.Dispatch<React.SetStateAction<Dataset[]>>}):
    React.ReactElement => {
    const sortOptions: SortType[] = ["Ascending", "Descending"];
    const viewOptions: ViewType[] = ["Gallery", "List"];
    const filterOptions: FilterType[] = ["Blah", "Bleh"];

    const [sortSelect, setSortSelect] = React.useState(false);
    const [viewSelect, setViewSelect] = React.useState(false);
    const [filterSelect, setFilterSelect] = React.useState(false);

    const [sortOption, setSortOption] = React.useState<SortType>();
    const [viewOption, setViewOption] = React.useState<ViewType>();
    const [filterOption, setFilterOption] = React.useState<FilterType[]>([]);

    

    const changeSortOption = (option: SortType): void => {
        setSortOption(option);
        setDataset(Utils.sortDatasets(datasets, option));
    }
    
    const changeViewOption = (option: ViewType): void => {
        setViewOption(option);
    }

    const changeFilterOption = (option: FilterType): void => {
        setFilterOption(currentOptions => {
            if (currentOptions.includes(option)) {
                 return currentOptions.filter(x => x != option);
            } else {
                return [...currentOptions, option];
            }
        })
    };



    return (
        <div className={styles.dropdownContainer}>
            <div className={styles.dropdown}>
            <div className ={styles.dropdownCategories}>
                <div className={`${styles.rotateDrop} ${sortSelect ? styles.rotateDropdown: ''}`}>
                <button onClick={() => setSortSelect(Utils.toggleSortSelect(sortSelect))}>
                <ArrowForwardIosRoundedIcon sx= {{width: "32px", height: "32px"}}className={styles.dropBtn} />
                </button>
                </div>
            <p>Sort</p>
            </div>
                <div className = {styles.dropdownOptions}>
                    {sortSelect && (
                    <div>
                        {sortOptions.map(option => (
                        <div 
                            key={option} 
                            onClick={() => changeSortOption(option)}
                            className={`${styles.selectOption} ${option === sortOption ? styles.selected : ''}`}>
                            {option.slice(0)}
                        </div>
                        ))}
                    </div>
                    )}
                </div>
            </div>
            <div className={styles.dropdown}>
                <div className ={styles.dropdownCategories}>
                    <div className={`${styles.rotateDrop} ${viewSelect ? styles.rotateDropdown: ''}`}>
                        <button onClick={() => setViewSelect(Utils.toggleViewSelect(viewSelect))}>
                            <ArrowForwardIosRoundedIcon sx= {{width: "32px", height: "32px"}}className={styles.dropBtn} />
                        </button>
                    </div>
                    <p>View</p>
                </div>
                <div className = {styles.dropdownOptions}>
                    {viewSelect && (
                        <div>
                        {viewOptions.map(option => (
                            <div 
                                key={option} 
                                onClick={() => changeViewOption(option)}
                                className={`${styles.selectOption} ${option === viewOption ? styles.selected : ''}`}>
                                {option.slice(0)}
                            </div>
                        ))}
                        </div>
                    )}
                </div>
            </div>
            <div className={styles.dropdown}>
                <div className ={styles.dropdownCategories}>
                    <div className ={`${styles.rotateDrop} ${filterSelect ? styles.rotateDropdown: ''}`}>
                        <button onClick={() => setFilterSelect(Utils.toggleFilterSelect(filterSelect))}>
                        <ArrowForwardIosRoundedIcon sx= {{width: "32px", height: "32px"}}className={styles.dropBtn} />
                        </button>
                    </div>
                    <p>Filter</p>
                </div>
                <div className = {styles.dropdownOptions}>
                    {filterSelect && (
                    <div>
                    {filterOptions.map(option => (
                        <div 
                            key={option} 
                            onClick={() => changeFilterOption(option)}
                            className={`${styles.selectOption} ${styles.multi} ${filterOption.includes(option) ? styles.selectedMulti : ''}`}>
                            {option.slice(0)}
                        </div>
                    ))}
                    </div>
                    )}
                </div>
            </div>
        </div>
    )
};
