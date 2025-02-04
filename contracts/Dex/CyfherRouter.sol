// SPDX-License-Identifier: GPL-3.0-or-later

pragma solidity ^0.8.24;

import {ICyfherFactory} from "../interfaces/ICyfherFactory.sol";
import {ICyfherRouter} from "../interfaces/ICyfherRouter.sol";
import {ICyfherPair} from "../interfaces/ICyfherPair.sol";
import {UniswapV2Library} from "../libraries/UniswapV2Library.sol";
import {ICyfherERC20} from "../interfaces/ICyfherERC20.sol";

import {Permissioned, Permission} from "@fhenixprotocol/contracts/access/Permissioned.sol";
import "@fhenixprotocol/contracts/FHE.sol";

contract CyfherRouter {
    // is ICyfherRouter {
    //solhint-disable-next-line immutable-vars-naming
    address public immutable factory;

    modifier ensure(uint256 deadline) {
        require(deadline >= block.timestamp, "UniswapV2Router: EXPIRED");
        _;
    }

    constructor(address _factory, address _WETH) {
        factory = _factory;
    }

    // **** ADD LIQUIDITY ****
    /*   function _addLiquidity(
        address tokenA,
        address tokenB,
        inEuint32 calldata amountADesired,
        inEuint32 calldata amountBDesired
    ) internal virtual returns (euint32 amountA, euint32 amountB) {
        if (ICyfherFactory(factory).getPair(tokenA, tokenB) == address(0)) {
            ICyfherFactory(factory).createPair(tokenA, tokenB);
        }
        //(uint256 reserveA, uint256 reserveB) = UniswapV2Library.getReserves(factory, tokenA, tokenB);

        //if (reserveA == 0 && reserveB == 0) {
        (amountA, amountB) = (amountADesired, amountBDesired);
        //} else {
        // uint256 amountBOptimal = UniswapV2Library.quote(amountADesired, reserveA, reserveB);
        // if (amountBOptimal <= amountBDesired) {
        //     require(amountBOptimal >= amountBMin, "UniswapV2Router: INSUFFICIENT_B_AMOUNT");
        //     (amountA, amountB) = (amountADesired, amountBOptimal);
        // } else {
        //     uint256 amountAOptimal = UniswapV2Library.quote(amountBDesired, reserveB, reserveA);
        //     assert(amountAOptimal <= amountADesired);
        //     require(amountAOptimal >= amountAMin, "UniswapV2Router: INSUFFICIENT_A_AMOUNT");
        //     (amountA, amountB) = (amountAOptimal, amountBDesired);
        // }
        //}
    } */

    // ERROR STACK TOO DEEP IF I USE 4 INPUT VARIABLES. Temporarily use 2, will implement struct() later on.
    /*  function addLiquidity(
        address tokenA,
        address tokenB,
        inEuint32 calldata encryptedAmountADesired,
        inEuint32 calldata encryptedAmountBDesired,
        bytes calldata permission,
        address to
    )
        external
        virtual
        returns (euint32 amountA, euint32 amountB, euint32 liquidity)
    {
        euint32 amountADesired = FHE.asEuint32(
            encryptedAmountADesired,
            inputProof
        );
        euint32 amountBDesired = FHE.asEuint32(
            encryptedAmountBDesired,
            inputProof
        );

        (amountA, amountB) = _addLiquidity(
            tokenA,
            tokenB,
            amountADesired,
            amountBDesired
        );
        address pair = UniswapV2Library.pairFor(factory, tokenA, tokenB);

        FHE.allowTransient(amountA, tokenA);
        FHE.allowTransient(amountB, tokenB);

        ICyfherERC20(tokenA).transferFrom(msg.sender, pair, amountA);
        ICyfherERC20(tokenB).transferFrom(msg.sender, pair, amountB);

        liquidity = ICyfherPair(pair).mint(to);
    } */
}
