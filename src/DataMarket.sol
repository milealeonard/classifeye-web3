// SPDX-License-Identifier: MIT

pragma solidity ^0.8.18;

import {console} from "forge-std/console.sol";

/**
 * struct info:
 * @author
 * @notice
 */
contract DataMarket {

	event DatasetCreated(address indexed creator, uint256 indexed datasetIndex);
	event DatasetUpdated(address indexed creator, uint256 indexed datasetIndex);
	event DatasetPurchased(address indexed purchaser, address indexed purchasedFrom, uint256 indexed datasetIndex);

    error DataMarket__OwnerDoesntOwnDataset();
    error DataMarket__DatasetIsntPublicToBuy();
    error DataMarket__SenderAlreadyOwnsDataset();
    error DataMarket__DidntSendEnoughEth();
    error DataMarket__TransferDidntGoThrough();
    error DataMarket__SenderDoesntOwnDataset();

    enum DatasetVisibility {
        PRIVATE,
        PUBLIC
    }

    struct Dataset {
        string name;
        string description;
        string data; //ifps link
        string sample; //ipfs link (unencrypted)
        uint256 price;
        address owner;
        DatasetVisibility visibility;
    }

    Dataset[] private s_datasets;
    mapping(address user => uint256[] ownedDatasets) private s_userToDatasets;

    function createDataset(
        string memory _name,
        string memory _description,
        string memory _data,
        string memory _sample,
        uint256 _price,
        uint256 _visibility
    ) public {
        Dataset memory dataset;
        dataset.name = _name;
        dataset.description = _description;
        dataset.data = _data;
        dataset.sample = _sample;
        dataset.price = _price;
        dataset.owner = msg.sender;
        dataset.visibility = DatasetVisibility(_visibility);
        uint256 newDatasetIdx = s_datasets.length;
        s_datasets.push(dataset);
        s_userToDatasets[msg.sender].push(newDatasetIdx);
		emit DatasetCreated(msg.sender, newDatasetIdx);
    }

    function listAllDatasets() public view returns (Dataset[] memory) {
        uint256 numDatasets = s_datasets.length;
		Dataset[] memory publicDatasets = new Dataset[](numDatasets);

		Dataset memory blankDataset;
		blankDataset.name = "private";

        for (uint256 i = 0; i < numDatasets; i++) {
            if (s_datasets[i].visibility == DatasetVisibility.PUBLIC) {
                publicDatasets[i] = s_datasets[i];
            } else {
				// if dataset isn't public just append an empty one
				publicDatasets[i] = blankDataset;
			}
        }

        return publicDatasets;
    }

    function listDatasetsForUser() public view returns (Dataset[] memory) {
        uint256[] memory datasetsOwned = s_userToDatasets[msg.sender];
        uint256 datasetsOwnedLength = datasetsOwned.length;
        Dataset[] memory _datasets = new Dataset[](datasetsOwnedLength);
        if (datasetsOwnedLength <= 0) {
            return _datasets;
        }

        for (uint256 i = 0; i < datasetsOwnedLength; i++) {
            _datasets[i] = s_datasets[datasetsOwned[i]];
        }
        return _datasets;
    }

    function _addressOwnsDataset(address _refOwner, uint256 _datasetIndex)
        internal
        view
        returns (bool, uint256[] memory)
    {
        uint256[] memory currOwnedDatasets = s_userToDatasets[_refOwner];
        uint256 ownedDatasetsLength = currOwnedDatasets.length;
        uint256[] memory ownedDatasetsAfterRemoval = _rederiveOwnershipsWithoutIndex(_refOwner, _datasetIndex);
        if (ownedDatasetsAfterRemoval.length == ownedDatasetsLength) {
            return (false, ownedDatasetsAfterRemoval);
        }
        return (true, ownedDatasetsAfterRemoval);
    }

    /**
     * @dev Remove the dataset from the owners owned datasets if they own it.
     * @param _refOwner owner who we are removing ownership of dataset from
     * @param _datasetIndex index of dataset we are removing ownership from _refOwner of
     */
    function _rederiveOwnershipsWithoutIndex(address _refOwner, uint256 _datasetIndex)
        internal
        view
        returns (uint256[] memory)
    {
        uint256[] memory currOwnedDatasets = s_userToDatasets[_refOwner];
        uint256 ownedDatasetsLength = currOwnedDatasets.length;
        uint256[] memory tempOwnedDatasets = new uint256[](ownedDatasetsLength);
        uint256 newDatasetCounter = 0;

        for (uint256 i = 0; i < ownedDatasetsLength; i++) {
            if (currOwnedDatasets[i] != _datasetIndex) {
                tempOwnedDatasets[newDatasetCounter] = currOwnedDatasets[i];
                newDatasetCounter++;
            }
        }

        uint256[] memory newOwnedDatasets = new uint256[](newDatasetCounter);
        for (uint256 i = 0; i < newDatasetCounter; i++) {
            newOwnedDatasets[i] = tempOwnedDatasets[i];
        }

        return newOwnedDatasets;
    }

    function purchaseDataset(uint256 _datasetIndex) public payable {
        // first ensure the request is sound/valid
        Dataset memory _dataset = s_datasets[_datasetIndex];

        // Step 1: Ensure sent enough money
        uint256 msgValue = msg.value;
        if (msgValue < _dataset.price) {
            revert DataMarket__DidntSendEnoughEth();
        }

        // Step 2: ensure this dataset is truly for sale
        if (_dataset.visibility != DatasetVisibility.PUBLIC || _dataset.price == 0) {
            revert DataMarket__DatasetIsntPublicToBuy();
        }

        // Step 3: ownership sanity check
        address currOwner = _dataset.owner;
        if (currOwner == msg.sender) {
            revert DataMarket__SenderAlreadyOwnsDataset();
        }
        (bool ownerOwnsDataset, uint256[] memory currOwnerNewOwnedDatasets) =
            _addressOwnsDataset(currOwner, _datasetIndex);
        if (!ownerOwnsDataset) {
            revert DataMarket__OwnerDoesntOwnDataset();
        }

        // if valid, then transfer the money
        (bool successFromContract,) = payable(address(currOwner)).call{value: msgValue}("");
        if (!successFromContract) {
            revert DataMarket__TransferDidntGoThrough();
        }

		emit DatasetPurchased(msg.sender, currOwner, _datasetIndex);

        s_datasets[_datasetIndex].owner = msg.sender;
        // then transfer the ownership in the contract
        s_userToDatasets[currOwner] = currOwnerNewOwnedDatasets;
        // TODO: First check the sender doesnt already own it
        s_userToDatasets[msg.sender].push(_datasetIndex);
    }

    function updateDataset(
        uint256 index,
        string memory newName,
        string memory newDescription,
        string memory newData,
        string memory newSample,
        uint256 newPrice,
        uint256 newVisibility
    ) public {
        Dataset memory _dataset = s_datasets[index];
        if (_dataset.owner != msg.sender) {
            revert DataMarket__SenderDoesntOwnDataset();
        }

        _dataset.name = newName;
        _dataset.description = newDescription;
        _dataset.data = newData;
        _dataset.sample = newSample;
        _dataset.price = newPrice;
        _dataset.visibility = DatasetVisibility(newVisibility);

        s_datasets[index] = _dataset;
		emit DatasetUpdated(msg.sender, index);
    }

    function reviewDataset(uint256 datasetIndex, uint256 rating, string memory review) public {}
}
