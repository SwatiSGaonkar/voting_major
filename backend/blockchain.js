const { ethers } = require("ethers");
const fs = require("fs");
const path = require("path");

const DEFAULT_RPC_URL = "http://127.0.0.1:8545";
const DEFAULT_PRIVATE_KEY =
  "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";

async function initializeBlockchain() {
  try {
    const provider = new ethers.JsonRpcProvider(
      process.env.RPC_URL || DEFAULT_RPC_URL
    );

    try {
      await provider.getNetwork();
      console.log("Connected to local Hardhat network");
    } catch (error) {
      throw new Error("Cannot connect to Hardhat node. Run: npx hardhat node");
    }

    const signer = new ethers.Wallet(
      process.env.PRIVATE_KEY || DEFAULT_PRIVATE_KEY,
      provider
    );

    console.log("Signer account:", await signer.getAddress());

    const contractPath = path.join(__dirname, "../contractAddress.json");

    if (!fs.existsSync(contractPath)) {
      throw new Error("contractAddress.json not found. Deploy the contract first.");
    }

    const contractData = JSON.parse(fs.readFileSync(contractPath, "utf8"));
    const contractAddress = contractData.address;

    if (!contractAddress) {
      throw new Error("contractAddress.json is missing the address field.");
    }

    const abi = [
      "function castVote(uint256 _candidate, bytes32 _nullifier) external",
      "function getVotes(uint256 _candidate) public view returns (uint256)",
      "function hasVoted(bytes32 _nullifier) public view returns (bool)",
      "function getResults() public view returns (uint256[4] memory)",
      "event VoteCast(uint256 indexed candidate, bytes32 indexed nullifier, uint256 timestamp)"
    ];

    const contract = new ethers.Contract(contractAddress, abi, signer);

    console.log("Contract found at:", contractAddress);
    console.log("Blockchain connection ready");

    return {
      contract,
      provider,
      signer,
      contractAddress
    };
  } catch (error) {
    console.error("Blockchain initialization failed:", error.message);
    throw error;
  }
}

module.exports = { initializeBlockchain };
