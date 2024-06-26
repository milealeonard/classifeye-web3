// SPDX-License-Identifier: MIT

pragma solidity ^0.8.18;

import {Test, console} from "forge-std/Test.sol";
import {DeployDataMarket} from "../../script/DeployDataMarket.s.sol";
import {DataMarket} from "../../src/DataMarket.sol";
import {DataMarketBaseTest} from "../DataMarketBaseTest.t.sol";

contract DataMarketUnitTest is DataMarketBaseTest {
    function testInit() public view {
        // listing datasets should be empty
        DataMarket.Dataset[] memory _datasets = dataMarket.listAllDatasets();
        assertEq(_datasets.length, 0);
    }

    function testCreateDataset() public {
        // when we create a dataset
        vm.expectEmit();
        // ensure we emit the datasetcreated event
        emit DataMarket.DatasetCreated(userOne, 0);
        _createDataset(userOne, 1, "name");

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
        _createDataset(userOne, 0, "name");

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
        _createDataset(userOne, 1, "name");

        // ensure the public dataset exists
        DataMarket.Dataset[] memory _datasets = dataMarket.listAllDatasets();
        assertEq(_datasets.length, 1);
        assertEq(_datasets[0].owner, userOne);

        // then when userTwo tries to buy it he can
        vm.prank(userTwo);
        vm.deal(userTwo, 100);
        vm.expectEmit();
        // ensure we emit the datasetcreated event
        emit DataMarket.DatasetPurchased(userTwo, userOne, 0);
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
        _createDataset(userOne, 0, "name");

        // then when userTwo tries to buy it he can
        vm.prank(userTwo);
        vm.deal(userTwo, 100);
        vm.expectRevert();
        dataMarket.purchaseDataset{value: 100}(0);
    }

    function testCantPurchaseWithoutEnoughMoney() public {
        // first, user one has a dataset available for purchase
        _createDataset(userOne, 1, "name");

        // then when userTwo tries to buy it he can
        vm.prank(userTwo);
        vm.deal(userTwo, 99);
        vm.expectRevert();
        dataMarket.purchaseDataset{value: 99}(0);
        assertEq(userTwo.balance, 99);
    }

    function testCanPurchaseWithTooMuchMoney() public {
        // first, user one has a dataset available for purchase
        _createDataset(userOne, 1, "name");

        // then when userTwo tries to buy it he can
        vm.prank(userTwo);
        vm.deal(userTwo, 101);
        dataMarket.purchaseDataset{value: 101}(0);

        // then userTwo still has 1 money left, and userOne has 100 moneys
        assertEq(userTwo.balance, 1);
        assertEq(userOne.balance, 100);
    }

    function testUpdateDatasetSimply() public {
        // when you create a dataset
        _createDataset(userOne, 0, "name");

        // then when you update it
        vm.prank(userOne);
        vm.expectEmit();
        emit DataMarket.DatasetUpdated(userOne, 0);
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
        // when you create a public dataset
        _createDataset(userTwo, 1, "name");

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
