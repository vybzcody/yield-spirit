const { ethers } = require("hardhat");

async function main() {
  console.log("Starting YieldSpirit deployment...");

  // Deploy YieldSpirit NFT contract
  console.log("Deploying YieldSpirit contract...");
  const YieldSpirit = await ethers.getContractFactory("YieldSpirit");
  const yieldSpirit = await YieldSpirit.deploy();
  await yieldSpirit.waitForDeployment();
  console.log("YieldSpirit deployed to:", await yieldSpirit.getAddress());

  // For demonstration, also deploy ERC6551 Registry and Account (in a real scenario, you'd likely use the canonical registry)
  console.log("Deploying ERC6551 Registry...");
  const ERC6551Registry = await ethers.getContractFactory("ERC6551Registry");
  const registry = await ERC6551Registry.deploy();
  await registry.waitForDeployment();
  console.log("ERC6551 Registry deployed to:", await registry.getAddress());

  console.log("Deploying ERC6551 Account Implementation...");
  const ERC6551Account = await ethers.getContractFactory("ERC6551Account");
  const accountImpl = await ERC6551Account.deploy();
  await accountImpl.waitForDeployment();
  console.log("ERC6551 Account Implementation deployed to:", await accountImpl.getAddress());

  console.log("Deployment completed successfully!");
  console.log("\nContract addresses:");
  console.log("- YieldSpirit:", await yieldSpirit.getAddress());
  console.log("- ERC6551 Registry:", await registry.getAddress());
  console.log("- ERC6551 Account Implementation:", await accountImpl.getAddress());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });