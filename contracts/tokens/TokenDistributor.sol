// SPDX-License-Identifier: MIT

pragma solidity ^0.8.24;

import "@fhenixprotocol/contracts/FHE.sol";
import {PFHERC20} from "./PFHERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract TokenDistributor is Ownable {
    constructor() Ownable(msg.sender) {}

    euint32 amount = FHE.asEuint32(100);

    function acceptOwnership(address tokenAddress) external onlyOwner {
        PFHERC20(tokenAddress).acceptOwnership();
    }

    function claim(address tokenAddress) external {
        PFHERC20(tokenAddress).mint(msg.sender, amount);
    }
}
