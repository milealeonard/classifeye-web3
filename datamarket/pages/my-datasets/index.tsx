import React from "react";
import { ListDatasets } from "../../components/MyDatasets/ListDatasets";
import { Dataset } from "../../constants";
import { getDataMarketContract } from "../../utils/DataContractUtils";
import { ethers } from "ethers";
import { NavBar } from "../../components/NavBar";
import {Option} from "../../constants"
import { updateDataset } from "@/utils/utils";

const MyDatasets = (): React.ReactElement => {
  const [datasets, setDatasets] = React.useState<Dataset[] | undefined>(
    undefined
  );
  const [loading, setLoading] = React.useState(true);
  const [accounts, setAccounts] = React.useState<string[] | undefined>(
    undefined
  );


  const [sortOption, setSortOption] = React.useState<string>('');

  const sortOptions: Option[] = [
    {option: 'Sort By', value: 0}, // Default state
    { option: 'Most Recent', value: 1 },
    { option: 'Price Asc', value: 2 },
    { option: 'Name Asc', value: 3 }
  ];

  const[viewOption, setViewOption] = React.useState<string>('');

  const viewOptions: Option[] = [
    {option: 'View By', value: 0},
    {option: 'Gallery', value: 1},
    {option: 'list', value: 2}
  ]


  const handleChangeSort = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const sortOption = event.target.value;
    setSortOption(sortOption);

    if (+sortOption == 1) {
      /* Most Recent, do later */
    } else if (+sortOption == 2) {
      /* Sort By Price */
      setDatasets(currentDatasets => {
        // Create a new array with the first dataset repeated 11 times
        const updatedDatasets = [...currentDatasets].sort((a, b) => +a.price - +b.price);
        return updatedDatasets;
      });
    } else if (+sortOption == 3) {
      /* Sort by name */
      setDatasets(currentDatasets => {
        const updatedDataset = [...currentDatasets].sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
        return updatedDataset;
      });

    }
  };

  const handleChangeView = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setViewOption(event.target.value);
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
    return <p>Loading...</p>;
  }

  if (!datasets || !accounts) {
    return <p>Error</p>;
  }




  return (
    <div className="flex flex-col  w-full h-screen">
      <NavBar title="My datasets" />
      {/* <div className="flex flex-row justify-left  w-full pl-2 text-black">
        <select  placeholder = {"Sort By"} id="dropdown" value={sortOption} onChange={handleChangeSort} style={{padding: '10px', width: "150px", marginRight: "20px"}}>
        {sortOptions.map((option, index) => (
          <option key={index} value={option.value}>
            {option.option}
          </option>
        ))}
        </select>
        <select  placeholder = {"View By"} id="dropdown" value={viewOption} onChange={handleChangeView} style={{padding: '10px', width: "150px"}}>
        {viewOptions.map((option, index) => (
          <option key={index} value={option.value}>
            {option.option}
          </option>
        ))}
        </select>
      </div> */}
      <div className="flex flex-row jusifty-center items-center">
        <ListDatasets forOwnersOnly datasets={datasets} accounts={accounts} />
      </div>
    </div>
  );
};

export default MyDatasets;
