const express = require("express");
const cors = require("cors");
const snarkjs = require("snarkjs");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

const vKey = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../build/verification_key.json"), "utf-8")
);

const proofPath = path.join(__dirname, "../build/proof.json");
const publicPath = path.join(__dirname, "../build/public.json");

const usedNullifiers = new Set();
const votes = { 1: 0, 2: 0, 3: 0 };

app.get("/", (req, res) => {
  res.send("Backend is running");
});

app.get("/results", (req, res) => {
  res.json(votes);
});

app.post("/vote", async (req, res) => {
  try {
    const { vote } = req.body;

    if (![1, 2, 3, "1", "2", "3"].includes(vote)) {
      return res.status(400).json({
        success: false,
        message: "Invalid candidate"
      });
    }

    const proof = JSON.parse(fs.readFileSync(proofPath, "utf-8"));
    const publicSignals = JSON.parse(fs.readFileSync(publicPath, "utf-8"));

    const isValid = await snarkjs.groth16.verify(vKey, publicSignals, proof);

    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: "Invalid proof"
      });
    }

    const nullifierHash = publicSignals[1];

    if (usedNullifiers.has(nullifierHash)) {
      return res.status(400).json({
        success: false,
        message: "Duplicate vote"
      });
    }

    usedNullifiers.add(nullifierHash);
    votes[vote] += 1;

    return res.status(200).json({
      success: true,
      message: "Vote recorded successfully",
      votes
    });
  } catch (error) {
    console.error("Error in /vote:", error);
    return res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});