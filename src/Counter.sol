// SPDX-License-Identifier: MIT

pragma solidity ^0.8.18;

/**
 * Example IPFS JSON metadata
 * Would be nice to store the entire dataset in one IPFS entry
 * ie bunch of encrypted strings
 * which can then be decrypted with private key
 * {
 *   "attributes": [
 *     {
 *       "trait_type": "Background",
 *       "value": "Pink"
 *     },
 *     {
 *       "trait_type": "Skin",
 *       "value": "Dark Gray"
 *     },
 *     {
 *       "trait_type": "Body",
 *       "value": "Bow Tie Blue"
 *     },
 *     {
 *       "trait_type": "Face",
 *       "value": "Blushing"
 *     },
 *     {
 *       "trait_type": "Head",
 *       "value": "Party Hat"
 *     }
 *   ],
 *   "description": "A collection 8888 Cute Chubby Pudgy Penquins sliding around on the freezing ETH blockchain.",
 *   "image": "ipfs://QmNf1UsmdGaMbpatQ6toXSkzDpizaGmC9zfunCyoz1enD5/penguin/6446.png",
 *   "name": "Pudgy Penguin #6446"
 * }
 */
contract DataMarket {
    // do i need a token or can i just use plain eth?
    //////// token or erc721
    // should i use a L2
    //
    struct Dataset {
        string name;
        string description;
        string data;
        uint256 price;
        address owner;
    }

    /**
     * TODO:
     * encrypt dataset
     * upload dataset to IFPS
     * decrypt dataset -> list dataset
     * ******* could/should it cost gas to list a dataset? thats dumb
     * ******* caching layer?
     * If i encrypt and upload off-chain i need to make sure that stats are good
     * so people who analyze whether to buy a dataset can trust the dataset
     *
     */
    mapping(address user => uint256 permittedDatasetsIndices) userToPermittedDatasets;

    function createDataset(string memory name, string memory description, string memory data, uint256 price) public {}

    function listDatasets() public {}

    function purchaseDataset(uint256 datasetIndex) public {}

    function reviewDataset(uint256 datasetIndex, uint256 rating, string memory review) public {}
}
