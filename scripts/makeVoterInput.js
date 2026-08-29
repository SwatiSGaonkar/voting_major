const fs = require("fs");
const circomlibjs = require("circomlibjs");

async function makeVoterInput() {
  const poseidon = await circomlibjs.buildPoseidon();
  const F = poseidon.F;

  const voters = JSON.parse(
    fs.readFileSync("./scripts/merkle.json", "utf8")
  );

  // Demo voter
  const voter = voters.voters.find(
    v => v.voterId === "VOTER-0003"
  );

  if (!voter) {
    throw new Error("VOTER-0001 not found");
  }

  // Convert the displayed secret key back to the
  // same numeric value used during registration
  const secret = BigInt(
    "0x" +
    Buffer.from(voter.secretKey, "utf8").toString("hex")
  );

  const electionId = 1n;

  // Demo vote: Candidate 1
  const vote = 3n;

  // Generate nullifier = Poseidon(secret, electionId)
  const nullifierHash = F.toString(
    poseidon([secret, electionId])
  );

  const input = {
    secret: secret.toString(),

    electionId: electionId.toString(),

    vote: vote.toString(),

    pathElements: voter.pathElements,

    pathIndices: voter.pathIndices,

    root: voter.root,

    nullifierHash,

    isVote1: vote === 1n ? "1" : "0",
    isVote2: vote === 2n ? "1" : "0",
    isVote3: vote === 3n ? "1" : "0"
  };

  fs.writeFileSync(
    "./circuits/input.json",
    JSON.stringify(input, null, 2)
  );

  console.log("\n========== ZKP INPUT ==========");
  console.log("Voter      :", voter.voterId);
  console.log("Secret Key :", voter.secretKey);
  console.log("Election   :", electionId.toString());
  console.log("Vote       :", vote.toString());
  console.log("Merkle Root:", voter.root);
  console.log("Nullifier  :", nullifierHash);
  console.log("===============================\n");

  console.log("circuits/input.json created successfully.");
}

makeVoterInput().catch(console.error);