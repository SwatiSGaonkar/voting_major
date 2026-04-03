const express = require("express");
const cors = require("cors");
const snarkjs = require("snarkjs");
const fs = require("fs");

const app = express();
app.use(cors());
app.use(express.json());

// Load verification key
const vKey = JSON.parse(
  fs.readFileSync("../build/verification_key.json")
);

// In-memory storage (simple for project)
const usedNullifiers = new Set();
const votes = { 1: 0, 2: 0, 3: 0 };

app.post("/vote", async (req, res) => {
  try {
    const { proof, publicSignals, vote } = req.body;

    // Verify proof
    const isValid = await snarkjs.groth16.verify(
      vKey,
      publicSignals,
      proof
    );

    if (!isValid) {
      return res.json({ success: false, message: "Invalid proof" });
    }

    // Extract nullifier (index 1)
    const nullifier = publicSignals[1];

    if (usedNullifiers.has(nullifier)) {
      return res.json({ success: false, message: "Duplicate vote" });
    }

    // Store nullifier and count vote
    usedNullifiers.add(nullifier);
    votes[vote] += 1;

    return res.json({ success: true, message: "Vote recorded", votes });

  } catch (err) {
    console.error(err);
    res.json({ success: false, message: "Server error" });
  }
});

app.get("/results", (req, res) => {
  res.json(votes);
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});