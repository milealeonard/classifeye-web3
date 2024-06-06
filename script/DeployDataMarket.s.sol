// SPDX-License-Identifier: MIT

pragma solidity ^0.8.18;

import {Script, console} from "forge-std/Script.sol";
import {DataMarket} from "../src/DataMarket.sol";

contract DeployDataMarket is Script {
    function run() public returns (address) {
        vm.startBroadcast();
        DataMarket dataMarket = new DataMarket();
        vm.stopBroadcast();
        return address(dataMarket);
    }
}
