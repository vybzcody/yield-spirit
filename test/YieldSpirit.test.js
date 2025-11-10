const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("YieldSpirit NFT", function () {
  let YieldSpirit;
  let yieldSpirit;
  let owner;
  let addr1;
  let addr2;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();

    YieldSpirit = await ethers.getContractFactory("YieldSpirit");
    yieldSpirit = await YieldSpirit.deploy();
    await yieldSpirit.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await yieldSpirit.owner()).to.equal(owner.address);
    });
  });

  describe("Minting", function () {
    it("Should mint a new token", async function () {
      const tokenId = await yieldSpirit.nextTokenId();
      await yieldSpirit.connect(addr1).safeMint(addr1.address);
      
      expect(await yieldSpirit.ownerOf(tokenId)).to.equal(addr1.address);
      expect(await yieldSpirit.nextTokenId()).to.equal(1);
    });
  });

  describe("Strategy Management", function () {
    let tokenId;

    beforeEach(async function () {
      tokenId = await yieldSpirit.nextTokenId();
      await yieldSpirit.connect(addr1).safeMint(addr1.address);
    });

    it("Should allow owner to set strategy", async function () {
      const name = "Conservative Yield";
      const minAPY = 500; // 5% in basis points
      const targetChains = ["Ethereum", "Polygon"];
      const targetAssets = ["USDC", "ETH"];

      await yieldSpirit.connect(addr1).setStrategy(
        tokenId, 
        name, 
        minAPY, 
        targetChains, 
        targetAssets
      );

      const strategy = await yieldSpirit.getStrategy(tokenId);
      expect(strategy.name).to.equal(name);
      expect(strategy.minAPY).to.equal(minAPY);
      expect(strategy.active).to.equal(true);
    });

    it("Should not allow non-owner to set strategy", async function () {
      const name = "Aggressive Yield";
      const minAPY = 1000;
      const targetChains = ["Ethereum", "Optimism"];
      const targetAssets = ["WBTC", "DAI"];

      await expect(
        yieldSpirit.connect(addr2).setStrategy(
          tokenId, 
          name, 
          minAPY, 
          targetChains, 
          targetAssets
        )
      ).to.be.revertedWith("Not token owner");
    });
  });

  describe("TBA Association", function () {
    let tokenId;
    let mockTBAAddress;

    beforeEach(async function () {
      tokenId = await yieldSpirit.nextTokenId();
      await yieldSpirit.connect(addr1).safeMint(addr1.address);
      mockTBAAddress = ethers.Wallet.createRandom().address;
    });

    it("Should allow owner to associate TBA", async function () {
      await yieldSpirit.connect(addr1).associateTBA(tokenId, mockTBAAddress);
      expect(await yieldSpirit.tokenBoundAccounts(tokenId)).to.equal(mockTBAAddress);
    });

    it("Should not allow non-owner to associate TBA", async function () {
      await expect(
        yieldSpirit.connect(addr2).associateTBA(tokenId, mockTBAAddress)
      ).to.be.revertedWith("Not token owner");
    });

    it("Should reject invalid TBA address", async function () {
      await expect(
        yieldSpirit.connect(addr1).associateTBA(tokenId, ethers.ZeroAddress)
      ).to.be.reverted;
    });
  });
});

describe("ERC6551 Registry", function () {
  let ERC6551Registry;
  let erc6551Registry;
  let ERC6551Account;
  let owner;

  beforeEach(async function () {
    [owner] = await ethers.getSigners();

    ERC6551Registry = await ethers.getContractFactory("ERC6551Registry");
    erc6551Registry = await ERC6551Registry.deploy();
    await erc6551Registry.waitForDeployment();

    ERC6551Account = await ethers.getContractFactory("ERC6551Account");
  });

  describe("Account Creation", function () {
    it("Should compute account address", async function () {
      // Deploy a minimal account implementation to use
      const accountImpl = await ERC6551Account.deploy();
      await accountImpl.waitForDeployment();
      
      const chainId = await ethers.provider.getNetwork().then(n => n.chainId);
      const tokenContract = owner.address; // Using an address as placeholder
      const tokenId = 1;
      const salt = ethers.keccak256(ethers.toUtf8Bytes("test"));

      const computedAddr = await erc6551Registry.account(
        await accountImpl.getAddress(),
        salt,
        chainId,
        tokenContract,
        tokenId
      );

      expect(computedAddr).to.be.properAddress;
    });
  });
});