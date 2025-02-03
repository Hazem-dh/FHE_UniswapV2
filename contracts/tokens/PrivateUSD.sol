// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {PFHERC20} from "./PFHERC20.sol";

contract PrivateUSD is PFHERC20 {
    constructor() PFHERC20("PrivateUSD", "pUSD", 3) {}
}
