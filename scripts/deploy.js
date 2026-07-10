const fs = require("fs");
const path = require("path");
const hre = require("hardhat");

async function main() {
  console.log("Deploying Voting smart contract...");

  const Voting = await hre.ethers.getContractFactory("Voting");
  const voting = await Voting.deploy();

  console.log("Deployment transaction:", voting.deployTransaction.hash);

  await voting.deployed();

  const deployedAddress = voting.address;
  const abiJson = voting.interface.format(hre.ethers.utils.FormatTypes.json);
  const abi = JSON.parse(abiJson);

  console.log("Contract deployed successfully");
  console.log("Contract address:", deployedAddress);

  const contractData = {
    address: deployedAddress,
    network: "localhost",
    chainId: 31337,
    deployedAt: new Date().toISOString(),
    abi
  };

  const contractPath = path.join(__dirname, "../contractAddress.json");
  fs.writeFileSync(contractPath, JSON.stringify(contractData, null, 2));
  console.log("Contract data saved to contractAddress.json");

  const abiPath = path.join(__dirname, "../contracts/Voting.abi.json");
  fs.writeFileSync(abiPath, JSON.stringify(abi, null, 2));
  console.log("Contract ABI saved to contracts/Voting.abi.json");

  console.log("Deployment complete");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Deployment failed:", error);
    process.exit(1);
  });
