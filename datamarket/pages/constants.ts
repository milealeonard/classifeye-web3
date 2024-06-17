//////////////////////
// INTERFACES/TYPES //
//////////////////////

export interface ClassiFile {
  blobby: string;
  content: string;
  name: string;
  classif: string | undefined;
}

export interface CreateCSVProps {
  grader: string;
  images: ClassiFile[];
}

export interface CreateDatasetProps extends CreateCSVProps {
  _datasetName: string;
  _datasetDescription: string;
  publicKeyProp?: string;
  _datasetVisibility: DatasetVisibility;
  _datasetPrice: number;
}

export type EthEncryptedData = {
  version: string;
  nonce: string;
  ephemPublicKey: string;
  ciphertext: string;
};

export interface ProviderAndAccountKey {
  provider: any;
  account: string;
  key: string;
}

export interface Dataset {
  data: string;
  name: string;
  owner: string;
  price: BigInt;
  sample: string;
  visibility: number;
  description: string;
}

export interface UpdateDatasetProps {
  index: number;
  newName: string;
  newDescription: string;
  newData: string;
  newSample: string;
  newPrice: number;
  newVisibility: number;
}

///////////
// Enums //
///////////

export enum DatasetVisibility {
  PRIVATE,
  PUBLIC,
}

///////////////
// Constants //
///////////////

export const DATAMARKET_ADDY = "0x9E2242E24953858C88bdB3e059679762522c9c74";

/**
 * Number of images to include from the dataset as a sample size
 */
export const MAX_SAMPLE_SIZE_COUNT = 5;
