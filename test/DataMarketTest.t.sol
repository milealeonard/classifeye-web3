// SPDX-License-Identifier: MIT

pragma solidity ^0.8.18;

import {Test, console} from "forge-std/Test.sol";
import {DeployDataMarket} from "../script/DeployDataMarket.s.sol";
import {DataMarket} from "../src/DataMarket.sol";

contract DataMarketTest is Test {
    DataMarket dataMarket;
    address userOne = makeAddr("userOne");
    address userTwo = makeAddr("userTwo");

    function setUp() public {
        DeployDataMarket deployer = new DeployDataMarket();
        address dataMarketAddy = deployer.run();
        dataMarket = DataMarket(dataMarketAddy);
    }

    function testInit() public view {
        // listing datasets should be empty
        DataMarket.Dataset[] memory _datasets = dataMarket.listAllDatasets();
        assertEq(_datasets.length, 0);
    }

    function testCreateDataset() public {
        // when we create a dataset
        vm.prank(userOne);
        dataMarket.createDataset({
            _name: "name",
            _description: "description",
            _data: "data",
            _sample: "sample",
            _price: 100,
            _visibility: 1
        });

        DataMarket.Dataset[] memory _datasets = dataMarket.listAllDatasets();
        assertEq(_datasets.length, 1);
        DataMarket.Dataset memory zeroth_dataset = _datasets[0];
        assertEq(zeroth_dataset.name, "name");
        assertEq(zeroth_dataset.description, "description");
        assertEq(zeroth_dataset.data, "data");
        assertEq(zeroth_dataset.price, 100);
    }

    function testCannotViewPrivateDataset() public {
        // when we create a dataset
        vm.prank(userOne);
        dataMarket.createDataset({
            _name: "name",
            _description: "description",
            _data: "data",
            _sample: "sample",
            _price: 100,
            _visibility: 0
        });

        DataMarket.Dataset[] memory _datasets = dataMarket.listAllDatasets();
        assertEq(_datasets.length, 1);
		assertEq(_datasets[0].name, "private");

        // however you should be able to see your own
        vm.prank(userOne);
        DataMarket.Dataset[] memory _datasetsForUser = dataMarket.listAllDatasets();

        assertEq(_datasetsForUser.length, 1);
        DataMarket.Dataset memory zeroth_dataset = _datasetsForUser[0];
        assertEq(zeroth_dataset.name, "name");
        assertEq(zeroth_dataset.description, "description");
        assertEq(zeroth_dataset.data, "data");
        assertEq(zeroth_dataset.price, 100);
    }

    function testPurchaseDataset() public {
        // first, user one has a dataset available for purchase
        vm.prank(userOne);
        dataMarket.createDataset({
            _name: "name",
            _description: "description",
            _sample: "sample",
            _data: "data",
            _price: 100,
            _visibility: 1
        });

        // ensure the public dataset exists
        DataMarket.Dataset[] memory _datasets = dataMarket.listAllDatasets();
        assertEq(_datasets.length, 1);
        assertEq(_datasets[0].owner, userOne);

        // then when userTwo tries to buy it he can
        vm.prank(userTwo);
        vm.deal(userTwo, 100);
        dataMarket.purchaseDataset{value: 100}(0);

        // money assertions
        assertEq(userTwo.balance, 0);
        assertEq(userOne.balance, 100);

        // ensure still one dataset and ownership has been transfered
        DataMarket.Dataset[] memory _datasetsPostTransfer = dataMarket.listAllDatasets();
        assertEq(_datasetsPostTransfer.length, 1);
        assertEq(_datasetsPostTransfer[0].owner, userTwo);
    }

    function testCantPurchasePrivateDataset() public {
        // first, user one has a dataset available for purchase
        vm.prank(userOne);
        dataMarket.createDataset({
            _name: "name",
            _description: "description",
            _data: "data",
            _sample: "sample",
            _price: 100,
            _visibility: 0
        });

        // then when userTwo tries to buy it he can
        vm.prank(userTwo);
        vm.deal(userTwo, 100);
        vm.expectRevert();
        dataMarket.purchaseDataset{value: 100}(0);
    }

    function testCantPurchaseWithoutEnoughMoney() public {
        // first, user one has a dataset available for purchase
        vm.prank(userOne);
        dataMarket.createDataset({
            _name: "name",
            _description: "description",
            _data: "data",
            _sample: "sample",
            _price: 100,
            _visibility: 1
        });

        // then when userTwo tries to buy it he can
        vm.prank(userTwo);
        vm.deal(userTwo, 99);
        vm.expectRevert();
        dataMarket.purchaseDataset{value: 99}(0);
    }

    function testUpdateDatasetSimply() public {
        // when you create a dataset
        vm.prank(userOne);
        dataMarket.createDataset({
            _name: "name",
            _description: "description",
            _data: "data",
            _sample: "sample",
            _price: 100,
            _visibility: 0
        });

        // then when you update it
        vm.prank(userOne);
        dataMarket.updateDataset({
            index: 0,
            newName: "newName",
            newDescription: "newDesc",
            newData: "newData",
            newSample: "newSample",
            newPrice: 1000,
            newVisibility: 1
        });

        // then when you list it
        vm.prank(userOne);
        DataMarket.Dataset[] memory _allDatasetsPost = dataMarket.listAllDatasets();
        assertEq(_allDatasetsPost[0].name, "newName");
        assertEq(_allDatasetsPost[0].description, "newDesc");
        assertEq(_allDatasetsPost[0].data, "newData");
        assertEq(_allDatasetsPost[0].sample, "newSample");
        assertEq(_allDatasetsPost[0].price, 1000);
        assertEq(uint256(_allDatasetsPost[0].visibility), 1);
        // still owns it
        assertEq(_allDatasetsPost[0].owner, userOne);
    }

    function testCantUpdateOthersDataset() public {
        // when you create a dataset
        vm.prank(userTwo);
        dataMarket.createDataset({
            _name: "name",
            _description: "description",
            _data: "data",
            _sample: "sample",
            _price: 100,
            _visibility: 1
        });

        // ensure we have a dataset
        DataMarket.Dataset[] memory _datasets = dataMarket.listAllDatasets();
        assertEq(_datasets.length, 1);

        // then when you update it
        vm.prank(userOne);
        vm.expectRevert();
        dataMarket.updateDataset({
            index: 0,
            newName: "newName",
            newDescription: "newDesc",
            newData: "newData",
            newSample: "newSample",
            newPrice: 1000,
            newVisibility: 1
        });
    }
}
