const fs = require("fs");
const crypto = require("crypto");
const circomlibjs = require("circomlibjs");

async function registerVoter() {
  const poseidon = await circomlibjs.buildPoseidon();
  const F = poseidon.F;

  const filePath = "./scripts/voters.json";

  let voters = [];

  if (fs.existsSync(filePath)) {
    voters = JSON.parse(
      fs.readFileSync(filePath, "utf8")
    );
  }

  // Readable voter ID
  const voterNumber = voters.length + 1;
  const voterId = `VOTER-${String(voterNumber).padStart(4, "0")}`;

  // Generate a short but random secret key
  const secretKey = crypto
    .randomBytes(12)
    .toString("base64url");

  // Convert secret key to a number for Poseidon
  const secret = BigInt(
    "0x" + Buffer.from(secretKey, "utf8").toString("hex")
  );

  // Generate commitment
  const commitment = F.toString(
    poseidon([secret])
  );

  const voter = {
    voterId,
    secretKey,
    commitment
  };

  voters.push(voter);

  fs.writeFileSync(
    filePath,
    JSON.stringify(voters, null, 2)
  );

  console.log("\n========== VOTER REGISTERED ==========");
  console.log("Voter ID   :", voterId);
  console.log("Secret Key :", secretKey);
  console.log("Commitment :", commitment);
  console.log("======================================");
  console.log("Keep this secret key private.");
  console.log("======================================\n");
}

registerVoter().catch(console.error);