const express = require("express");
const cors = require("cors");
const snarkjs = require("snarkjs");
const fs = require("fs");
const path = require("path");
const { initializeBlockchain } = require("./blockchain");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: "5mb" }));

const vKeyPath = path.join(__dirname, "../build/verification_key.json");
const demoProofPath = path.join(__dirname, "../client/public/demo/proof.json");
const demoPublicPath = path.join(__dirname, "../client/public/demo/public.json");

const vKey = JSON.parse(fs.readFileSync(vKeyPath, "utf-8"));

let blockchainConnection = null;

function formatResults(results) {
  return {
    1: results[0].toString(),
    2: results[1].toString(),
    3: results[2].toString(),
    candidate1: results[0].toString(),
    candidate2: results[1].toString(),
    candidate3: results[2].toString(),
    total: results[3].toString()
  };
}

function normalizeCandidate(value) {
  const candidate = Number(value);
  return Number.isInteger(candidate) && candidate >= 1 && candidate <= 3
    ? candidate
    : null;
}

function loadDemoProof() {
  return {
    proof: JSON.parse(fs.readFileSync(demoProofPath, "utf-8")),
    publicSignals: JSON.parse(fs.readFileSync(demoPublicPath, "utf-8"))
  };
}

function publicSignalToNullifier(publicSignals) {
  if (!Array.isArray(publicSignals) || publicSignals.length < 4) {
    throw new Error("Missing nullifier in public signals");
  }

  const nullifierBigInt = BigInt(publicSignals[3]);

  return "0x" + nullifierBigInt.toString(16).padStart(64, "0");
}

async function getBlockchainOrThrow() {
  if (!blockchainConnection) {
    throw new Error("Blockchain is not connected");
  }

  return blockchainConnection;
}

async function startup() {
  try {
    console.log("Starting voting backend server...");
    blockchainConnection = await initializeBlockchain();
    console.log("Blockchain connection established");
  } catch (error) {
    console.error("Startup failed:", error.message);
    console.error("Start a Hardhat node and deploy the contract first:");
    console.error("  npx hardhat node");
    console.error("  npx hardhat run scripts/deploy.js --network localhost");
    process.exit(1);
  }
}

app.get("/", (req, res) => {
  res.send("ZKP blockchain voting backend is running");
});

app.get("/status", (req, res) => {
  res.json({
    status: "running",
    blockchain: blockchainConnection ? "connected" : "disconnected",
    contract: blockchainConnection?.contractAddress || null
  });
});

app.get("/results", async (req, res) => {
  try {
    const { contract } = await getBlockchainOrThrow();
    const results = await contract.getResults();
    res.json(formatResults(results));
  } catch (error) {
    console.error("Error fetching results:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch results"
    });
  }
});

app.post("/vote", async (req, res) => {
  try {
    const candidate = normalizeCandidate(req.body.vote ?? req.body.candidate);

    if (!candidate) {
      return res.status(400).json({
        success: false,
        message: "Invalid candidate. Must be 1, 2, or 3"
      });
    }

    const bodyProof = req.body.proof && req.body.publicSignals
      ? { proof: req.body.proof, publicSignals: req.body.publicSignals }
      : loadDemoProof();

    const isValid = await snarkjs.groth16.verify(
      vKey,
      bodyProof.publicSignals,
      bodyProof.proof
    );

    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: "Invalid proof - ZKP verification failed"
      });
    }

    const nullifier = publicSignalToNullifier(bodyProof.publicSignals);
    const { contract } = await getBlockchainOrThrow();
    const alreadyVoted = await contract.hasVoted(nullifier);

    if (alreadyVoted) {
      return res.status(400).json({
        success: false,
        message: "Duplicate vote - this voter has already voted"
      });
    }

    const tx = await contract.castVote(candidate, nullifier);
    const receipt = await tx.wait();
    const results = await contract.getResults();

    return res.json({
      success: true,
      message: "Vote recorded on blockchain successfully",
      transactionHash: receipt.hash,
      blockNumber: receipt.blockNumber,
      votes: formatResults(results)
    });
  } catch (error) {
    console.error("Error in /vote:", error);
    return res.status(500).json({
      success: false,
      message: "Server error: " + error.message
    });
  }
});

app.post("/vote/test", async (req, res) => {
  try {
    const candidate = normalizeCandidate(req.body.candidate ?? req.body.vote);

    if (!candidate) {
      return res.status(400).json({
        success: false,
        message: "Invalid candidate. Must be 1, 2, or 3"
      });
    }

    const { contract } = await getBlockchainOrThrow();
    const nullifier =
      req.body.nullifier ||
      "0x" + BigInt(Date.now()).toString(16).padStart(64, "0");

    const alreadyVoted = await contract.hasVoted(nullifier);

    if (alreadyVoted) {
      return res.status(400).json({
        success: false,
        message: "Duplicate vote - this voter has already voted"
      });
    }

    const tx = await contract.castVote(candidate, nullifier);
    const receipt = await tx.wait();
    const results = await contract.getResults();

    return res.json({
      success: true,
      message: "Test vote recorded on blockchain successfully",
      transactionHash: receipt.hash,
      blockNumber: receipt.blockNumber,
      nullifier,
      votes: formatResults(results)
    });
  } catch (error) {
    console.error("Error in /vote/test:", error);
    return res.status(500).json({
      success: false,
      message: "Server error: " + error.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
  console.log("Endpoints: POST /vote, POST /vote/test, GET /results, GET /status");
});

startup();
