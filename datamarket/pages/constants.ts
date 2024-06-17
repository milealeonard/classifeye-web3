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

export interface UpdateOrCreateDatasetProps {
  name: string;
  setName: (val: string) => void;
  description: string;
  setDescription: (val: string) => void;
  price: number | "";
  setPrice: (val: number) => void;
  visibility: DatasetVisibility;
  setVisibility: (newVis: DatasetVisibility) => void;
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

export const DATAMARKET_ADDY = "0xE531c5c8F02Ff6185F5C89D43F2E930e33A0D4A9";

/**
 * Number of images to include from the dataset as a sample size
 */
export const MAX_SAMPLE_SIZE_COUNT = 5;
