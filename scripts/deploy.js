const { ethers } = require("hardhat");

async function main() {
  console.log("Starting YieldSpirit deployment...");
  
  try {
    // Get the deployer account
    const signers = await ethers.getSigners();
    if (signers.length === 0) {
      throw new Error("No signers available. Please set PRIVATE_KEY environment variable.");
    }
    
    const deployer = signers[0];
    console.log("Deploying contracts with account:", deployer.address);
    
    const balance = await ethers.provider.getBalance(deployer.address);
    console.log("Account balance:", ethers.formatEther(balance), "ETH");
    
    if (balance === 0n) {
      throw new Error("Deployer account has no ETH. Please fund the account first.");
    }

    // Deploy YieldSpirit NFT contract
    console.log("Deploying YieldSpirit contract...");
    const YieldSpirit = await ethers.getContractFactory("YieldSpirit");
    const yieldSpirit = await YieldSpirit.deploy();
    await yieldSpirit.waitForDeployment();
    const yieldSpiritAddress = await yieldSpirit.getAddress();
    console.log("YieldSpirit deployed to:", yieldSpiritAddress);

    // Deploy ERC6551 Registry
    console.log("Deploying ERC6551 Registry...");
    const ERC6551Registry = await ethers.getContractFactory("ERC6551Registry");
    const registry = await ERC6551Registry.deploy();
    await registry.waitForDeployment();
    const registryAddress = await registry.getAddress();
    console.log("ERC6551 Registry deployed to:", registryAddress);

    // Deploy ERC6551 Account Implementation
    console.log("Deploying ERC6551 Account Implementation...");
    const ERC6551Account = await ethers.getContractFactory("ERC6551Account");
    const accountImpl = await ERC6551Account.deploy();
    await accountImpl.waitForDeployment();
    const accountImplAddress = await accountImpl.getAddress();
    console.log("ERC6551 Account Implementation deployed to:", accountImplAddress);

    console.log("\n✅ Deployment completed successfully!");
    console.log("\n📋 Contract addresses:");
    console.log("- YieldSpirit:", yieldSpiritAddress);
    console.log("- ERC6551 Registry:", registryAddress);
    console.log("- ERC6551 Account Implementation:", accountImplAddress);
    
    console.log("\n🔧 Add this to your GitHub secrets:");
    console.log(`VITE_YIELDSPIRIT_CONTRACT_ADDRESS=${yieldSpiritAddress}`);
    
  } catch (error) {
    console.error("❌ Deployment failed:", error.message);
    throw error;
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });