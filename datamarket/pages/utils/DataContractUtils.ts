import { DATAMARKET_ABI } from "../DataMarketABI";
import { DATAMARKET_ADDY } from "../constants";
import { ethers } from "ethers";

interface DataMarketReturn {
  provider: any;
  dataContract: ethers.Contract;
}

export const getDataMarketContract = (
  signer: any
): ethers.Contract | undefined => {
  if (!signer) {
    return undefined;
  }

  const dataContract = new ethers.Contract(
    DATAMARKET_ADDY,
    DATAMARKET_ABI,
    signer
  );
  return dataContract;
};
