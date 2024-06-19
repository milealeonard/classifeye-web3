// SPDX-License-Identifier: MIT

pragma solidity ^0.8.18;

import {Test, console} from "forge-std/Test.sol";
import {DeployDataMarket} from "../script/DeployDataMarket.s.sol";
import {DataMarket} from "../src/DataMarket.sol";

// base test class for unit and integration to inherit from
contract DataMarketBaseTest is Test {
    DataMarket dataMarket;
    address userOne = makeAddr("userOne");
    address userTwo = makeAddr("userTwo");

    function setUp() public {
        DeployDataMarket deployer = new DeployDataMarket();
        address dataMarketAddy = deployer.run();
        dataMarket = DataMarket(dataMarketAddy);
    }

    function _createDataset(address user, uint256 visibility, string memory name) internal {
        vm.prank(user);
        dataMarket.createDataset({
            _name: name,
            _description: "description",
            _data: "data",
            _sample: "sample",
            _price: 100,
            _visibility: visibility
        });
    }
}
