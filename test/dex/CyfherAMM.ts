import { expect } from "chai";
import hre, { ethers } from "hardhat";
import { PFHERC20, CyfherFactory, CyfherRouter } from "../../typechain-types";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";
import {
  getTokensFromFaucet,
} from "../../utils/instance";



describe("CyfherFactory", function () {

  let signer1: SignerWithAddress;
  let signer2: SignerWithAddress;
  let signer3: SignerWithAddress;


  let factory: CyfherFactory;
  let factoryAddress: string;
  let router: CyfherRouter;
  let routerAddress: string;

  let token1: PFHERC20;
  let token1Address: string;
  let token2: PFHERC20;
  let token2Address: string;


  before(async () => {
    signer1 = (await ethers.getSigners())[0];
    signer2 = (await ethers.getSigners())[1];
    signer3 = (await ethers.getSigners())[2];


    await getTokensFromFaucet(hre, signer1.address);
    await getTokensFromFaucet(hre, signer2.address);
    await getTokensFromFaucet(hre, signer3.address);

  });

  beforeEach(async () => {
    //Deploy FHERC20
    const FHERC20Factory = await ethers.getContractFactory("PFHERC20");
    const CyfherFactory = await ethers.getContractFactory("CyfherFactory");
    const routerFactory = await ethers.getContractFactory("CyfherRouter");

    factory = await CyfherFactory.deploy(signer1);
    await factory.waitForDeployment();
    router = await routerFactory.deploy(signer1);
    await router.waitForDeployment()
    token1 = await FHERC20Factory.deploy("token1", "TKN1", 3);
    await token1.waitForDeployment();
    token2 = await FHERC20Factory.deploy("token2", "TKN2", 3);
    await token2.waitForDeployment();

    factoryAddress = await factory.getAddress();
    token1Address = await token1.getAddress();
    token2Address = await token2.getAddress();
    token2Address = await router.getAddress();


  });
})
/*
  describe("Deployment testing", function () {
    it("should mint erc20 token to user", async function () {
      const transaction = await this.EURContract.mint(this.signers.alice, 1000);
      await transaction.wait();

      // Reencrypt Alice's balance
      const balanceHandleAlice = await this.EURContract.balanceOf(this.signers.alice);
      const balanceAliceEUR = await reencryptEuint64(
        this.signers.alice,
        this.fhevm,
        balanceHandleAlice,
        this.EURContractAddress,
      );

      expect(balanceAliceEUR).to.equal(1000);

      const totalSupplyEUR = await this.EURContract.totalSupply();
      expect(totalSupplyEUR).to.equal(1000);
    });

    it("should add a new pair to the factory", async function () {
      const pairsLengthBeforeCreation = await this.uniswapV2Factory.allPairsLength();
      expect(pairsLengthBeforeCreation).to.equal(0);

      const transaction = await this.uniswapV2Factory.createPair(this.EURContractAddress, this.USDContractAddress);
      await transaction.wait();

      const pairsLengthAfterCreation = await this.uniswapV2Factory.allPairsLength();
      expect(pairsLengthAfterCreation).to.equal(1);
    });

    it("should register the correct tokens within a pair", async function () {
      const transaction = await this.uniswapV2Factory.createPair(this.EURContractAddress, this.USDContractAddress);
      await transaction.wait();

      const addressPairCreated = await this.uniswapV2Factory.getPair(this.EURContractAddress, this.USDContractAddress);

      const UniswapV2PairFactory = await ethers.getContractFactory("CyfherPair");

      // Load uniswapV2PairContract just created
      const uniswapV2PairContract = new ethers.BaseContract(
        addressPairCreated,
        UniswapV2PairFactory.interface,
        this.signers.alice,
      );
      expect(await uniswapV2PairContract.getAddress()).to.equal(addressPairCreated);

      const factoryVariableFromPairContract = await uniswapV2PairContract.factory();
      expect(this.uniswapV2FactoryAddress).to.equal(factoryVariableFromPairContract);

      const token0AddressFromPairContract = await uniswapV2PairContract.token0();
      expect(this.EURContractAddress).to.equal(token0AddressFromPairContract);

      const token1AddressFromPairContract = await uniswapV2PairContract.token1();
      expect(this.USDContractAddress).to.equal(token1AddressFromPairContract);

      const totalSupplyFromPairContract = await uniswapV2PairContract.totalSupply();
      expect(totalSupplyFromPairContract).to.equal(0);
    });
  });

  describe("Liquidity providing testing", function () {
    beforeEach(async function () {
      const mintEUR = await this.EURContract.mint(this.signers.alice, 3000);
      await mintEUR.wait();

      const mintUSD = await this.USDContract.mint(this.signers.alice, 5000);
      await mintUSD.wait();

      // Give approval required for EUR
      const inputAllowanceEUR = this.fhevm.createEncryptedInput(this.EURContractAddress, this.signers.alice.address);
      inputAllowanceEUR.add64(2500);
      const encryptedInputAllowanceEUR = await inputAllowanceEUR.encrypt();
      const approvalEURTransaction = await this.EURContract["approve(address,bytes32,bytes)"](
        this.uniswapV2RouterAddress,
        encryptedInputAllowanceEUR.handles[0],
        encryptedInputAllowanceEUR.inputProof,
      );
      await approvalEURTransaction.wait();

      // Give approval required for USD
      const inputAllowanceUSD = this.fhevm.createEncryptedInput(this.USDContractAddress, this.signers.alice.address);
      inputAllowanceUSD.add64(4000);
      const encryptedInputAllowanceUSD = await inputAllowanceUSD.encrypt();
      const approvalUSDTransaction = await this.USDContract["approve(address,bytes32,bytes)"](
        this.uniswapV2RouterAddress,
        encryptedInputAllowanceUSD.handles[0],
        encryptedInputAllowanceUSD.inputProof,
      );
      await approvalUSDTransaction.wait();

      // Add first liquiidty
      const inputAddLiquidity = this.fhevm.createEncryptedInput(
        this.uniswapV2RouterAddress,
        this.signers.alice.address,
      );
      inputAddLiquidity.add64(1337).add64(2000);
      const encryptedInputAddLiquidity = await inputAddLiquidity.encrypt();

      const transactionAddLiquidity = await this.uniswapV2Router.addLiquidity(
        this.EURContractAddress,
        this.USDContractAddress,
        encryptedInputAddLiquidity.handles[0],
        encryptedInputAddLiquidity.handles[1],
        encryptedInputAddLiquidity.inputProof,
        this.signers.alice,
      );
      await transactionAddLiquidity.wait();
    });

    it("should give token allowances to provide liquidity", async function () {
      // Verify EUR allowance
      const allowanceEUR = await this.EURContract.allowance(this.signers.alice, this.uniswapV2RouterAddress);
      const decryptedAllowanceEUR = await reencryptEuint64(
        this.signers.alice,
        this.fhevm,
        allowanceEUR,
        this.EURContractAddress,
      );
      expect(decryptedAllowanceEUR).to.equal(2500 - 1337);

      // Verify USD allowance
      const allowanceUSD = await this.USDContract.allowance(this.signers.alice, this.uniswapV2RouterAddress);
      const decryptedAllowanceUSD = await reencryptEuint64(
        this.signers.alice,
        this.fhevm,
        allowanceUSD,
        this.USDContractAddress,
      );
      expect(decryptedAllowanceUSD).to.equal(4000 - 2000);
    });

    it("should create a new pair if it doesn't exist", async function () {
      const pairsLengthAfterCreation = await this.uniswapV2Factory.allPairsLength();
      expect(pairsLengthAfterCreation).to.equal(1);
    });

    it("should transfer liquidity tokens to the pool", async function () {
      // Get pair address
      const addressPairCreated = await this.uniswapV2Factory.getPair(this.EURContractAddress, this.USDContractAddress);
      const balanceLPEUR = await this.EURContract.balanceOf(addressPairCreated);
      const balanceLPEURdecrypted = await debug.decrypt64(balanceLPEUR); //would not work in testnet
      expect(balanceLPEURdecrypted).to.equal(1337);

      const balanceLPUSD = await this.USDContract.balanceOf(addressPairCreated);
      const balanceLPUSDdecrypted = await debug.decrypt64(balanceLPUSD); //would not work in testnet
      expect(balanceLPUSDdecrypted).to.equal(2000);
    });

    it("should be possible to add liquidity a second time", async function () {
      // Second add liquidity transaction
      const secondAddLiquidityInput = this.fhevm.createEncryptedInput(
        this.uniswapV2RouterAddress,
        this.signers.alice.address,
      );
      secondAddLiquidityInput.add64(10).add64(10);
      const secondAddLiquidityInputEncrypted = await secondAddLiquidityInput.encrypt();
      const secondAddLiquidityTransaction = await this.uniswapV2Router.addLiquidity(
        this.EURContractAddress,
        this.USDContractAddress,
        secondAddLiquidityInputEncrypted.handles[0],
        secondAddLiquidityInputEncrypted.handles[1],
        secondAddLiquidityInputEncrypted.inputProof,
        this.signers.alice,
      );
      await secondAddLiquidityTransaction.wait();

      const addressPairCreated = await this.uniswapV2Factory.getPair(this.EURContractAddress, this.USDContractAddress);

      const UniswapV2PairFactory = await ethers.getContractFactory("CyfherPair");

      // Load uniswapV2PairContract just created
      const uniswapV2PairContract = new ethers.BaseContract(
        addressPairCreated,
        UniswapV2PairFactory.interface,
        this.signers.alice,
      );

      const totalSupplyLP = await uniswapV2PairContract.totalSupply();
      const totalSupplyLPDecrypted = await debug.decrypt64(totalSupplyLP); //would not work in testnet
      expect(totalSupplyLPDecrypted).to.equal(1337 * 2000 + 10 * 10);
    });
  });
});
 */