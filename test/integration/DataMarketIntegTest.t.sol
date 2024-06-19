// SPDX-License-Identifier: MIT

pragma solidity ^0.8.18;

import {Test, console} from "forge-std/Test.sol";
import {DeployDataMarket} from "../../script/DeployDataMarket.s.sol";
import {DataMarket} from "../../src/DataMarket.sol";
import {DataMarketBaseTest} from "../DataMarketBaseTest.t.sol";

contract DataMarketUnitTest is DataMarketBaseTest {
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

    function testSwapOwnershipPrivatePublic() public {
        // when you create a private dataset
        _createDataset(userOne, 0, "name");

        // then userTwo can't see it when he lists it (although it exists)
        vm.prank(userTwo);
        DataMarket.Dataset[] memory _datasets = dataMarket.listAllDatasets();
        assertEq(_datasets.length, 1);
        assertEq(_datasets[0].name, "private");
        assertEq(_datasets[0].description, "");
        assertEq(_datasets[0].data, "");

        // then userOne updates it to be public
        vm.prank(userOne);
        // fetch datasets again so we can only update the visibilty, leaving everythign else as is
        DataMarket.Dataset[] memory _datasetsViewableByUserOne = dataMarket.listAllDatasets();

        vm.prank(userOne);
        dataMarket.updateDataset({
            index: 0,
            newName: _datasetsViewableByUserOne[0].name,
            newDescription: _datasetsViewableByUserOne[0].description,
            newData: _datasetsViewableByUserOne[0].data,
            newSample: _datasetsViewableByUserOne[0].sample,
            newPrice: _datasetsViewableByUserOne[0].price,
            newVisibility: 1
        });

        // then userTwo purchases it
        vm.prank(userTwo);
        vm.deal(userTwo, 100);
        dataMarket.purchaseDataset{value: 100}(0);

        // then makes it private
        vm.prank(userTwo);
        dataMarket.updateDataset({
            index: 0,
            newName: _datasets[0].name,
            newDescription: _datasets[0].description,
            newData: _datasets[0].data,
            newSample: _datasets[0].sample,
            newPrice: _datasets[0].price,
            newVisibility: 0
        });

        // now when userOne tries to see it, he can't
        vm.prank(userOne);
        DataMarket.Dataset[] memory _datasetsAfterTwoPurchase = dataMarket.listAllDatasets();
        assertEq(_datasetsAfterTwoPurchase.length, 1);
        assertEq(_datasetsAfterTwoPurchase[0].name, "private");
        assertEq(_datasetsAfterTwoPurchase[0].description, "");
        assertEq(_datasetsAfterTwoPurchase[0].data, "");

        // and finally userTwo has no money left, but userOne got 100
        assertEq(userTwo.balance, 0);
        assertEq(userOne.balance, 100);
    }

    function testOwnsTwoSellsOne() public {
        // create two datasets
        _createDataset(userOne, 1, "name1");
        _createDataset(userOne, 1, "name2");

        // then user two purchases the second one
        vm.prank(userTwo);
        vm.deal(userTwo, 100);
        dataMarket.purchaseDataset{value: 100}(1);

        // now userTwo ones the first one, and userOne owns the other
        DataMarket.Dataset[] memory _datasets = dataMarket.listAllDatasets();
        assertEq(_datasets[0].owner, userOne);
        assertEq(_datasets[1].owner, userTwo);
    }
}
