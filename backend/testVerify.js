const snarkjs = require("snarkjs");
const fs = require("fs");
const path = require("path");

async function main() {
  try {
    const vKey = JSON.parse(
      fs.readFileSync(path.join(__dirname, "../build/verification_key.json"), "utf-8")
    );

    const proof = JSON.parse(
      fs.readFileSync(path.join(__dirname, "../build/proof.json"), "utf-8")
    );

    const publicSignals = JSON.parse(
      fs.readFileSync(path.join(__dirname, "../build/public.json"), "utf-8")
    );

    console.log("Loaded files successfully");
    console.log("Public signals:", publicSignals);

    const result = await snarkjs.groth16.verify(vKey, publicSignals, proof);

    console.log("Verification result:", result);
  } catch (err) {
    console.error("Error in testVerify:", err);
  }
}

main();