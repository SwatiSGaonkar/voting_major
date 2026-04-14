const fs = require("fs");
const circomlibjs = require("circomlibjs");

async function main() {
  const poseidon = await circomlibjs.buildPoseidon();
  const F = poseidon.F;

  const secret = 123n;
  const electionId = 1n;
  const vote = 1n;

  // commitment = Poseidon(secret)
  const commitment = F.toString(poseidon([secret]));

  // nullifierHash = Poseidon(secret, electionId)
  const nullifierHash = F.toString(poseidon([secret, electionId]));

  // Simple demo Merkle path for depth 3:
  // all siblings = 0, all path directions = 0 (always left)
  const pathElements = ["0", "0", "0"];
  const pathIndices = ["0", "0", "0"];

  // Build root step by step
  const h1 = F.toString(poseidon([BigInt(commitment), 0n]));
  const h2 = F.toString(poseidon([BigInt(h1), 0n]));
  const root = F.toString(poseidon([BigInt(h2), 0n]));

  const input = {
    secret: secret.toString(),
    electionId: electionId.toString(),
    vote: vote.toString(),

    pathElements,
    pathIndices,

    root,
    nullifierHash,

    isVote1: vote === 1n ? "1" : "0",
    isVote2: vote === 2n ? "1" : "0",
    isVote3: vote === 3n ? "1" : "0"
  };

  fs.writeFileSync("./circuits/input.json", JSON.stringify(input, null, 2));
  console.log("input.json created successfully");
  console.log(input);
}

main().catch(console.error);