// SPDX-License-Identifier: MIT

pragma solidity ^0.8.18;

import {Script, console} from "forge-std/Script.sol";
import {DataMarket} from "../src/DataMarket.sol";
import {ERC1967Proxy} from "@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol";

contract DeployDataMarket is Script {
	function run() external returns (address) {
        address proxy = deployMarket();
        return proxy;
    }

    function deployMarket() public returns (address) {
        vm.startBroadcast();
        DataMarket market = new DataMarket();
        ERC1967Proxy proxy = new ERC1967Proxy(address(market), "");
        DataMarket(address(proxy)).initialize(address(market));
        vm.stopBroadcast();
        return address(proxy);
    }
}
