//////////////////////
// INTERFACES/TYPES //
//////////////////////

import internal from "stream";

export interface ClassiFile {
  blobby: Blob;
  content: string;
  name: string;
  grader?: string;
  classif: string | undefined;
}

export interface CreateCSVProps {
  grader: string;
  images: ClassiFile[];
  publicKeyProp?: string;
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

export interface Option {
  option: string;
  value: number;
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

export interface EncryptedDataAndSample {
  sample: string;
  data: string;
}

export interface UnzippedContent {
  imgUrls: string[];
  files: ClassiFile[] | undefined;
}

// TODO: just make it be = classifile?
export interface ImgNameAndUrl {
  name: string;
  blobby: Blob;
  url: string;
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


export const DATAMARKET_ADDY = "0x5EDB4CB5b94bE5EaAc2f1d63c41b0EFcc62547A8";

/**
 * Number of images to include from the dataset as a sample size
 */
export const MAX_SAMPLE_SIZE_COUNT = 5;

export const GREATERTHAN10TOLETTER = new Map<number, string>([
  [9, "a"],
  [10, "b"],
  [11, "c"],
  [12, "d"],
  [13, "e"],
  [14, "f"],
  [15, "g"],
  [16, "h"],
  [17, "i"],
  [18, "j"],
  [19, "k"],
  [20, "l"],
  [21, "m"],
  [22, "n"],
  [23, "o"],
  [24, "p"],
  [25, "q"],
]);
