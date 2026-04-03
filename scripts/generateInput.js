const circomlibjs = require("circomlibjs");
const fs = require("fs");

async function main() {
  const poseidon = await circomlibjs.buildPoseidon();
  const F = poseidon.F;

  function hash1(a) {
    return BigInt(F.toString(poseidon([a])));
  }

  function hash2(a, b) {
    return BigInt(F.toString(poseidon([a, b])));
  }

  const electionId = 101n;

  const voterSecrets = [11n, 22n, 33n, 44n, 55n, 66n, 77n, 88n];
  const commitments = voterSecrets.map((s) => hash1(s));

  const level1 = [];
  for (let i = 0; i < commitments.length; i += 2) {
    level1.push(hash2(commitments[i], commitments[i + 1]));
  }

  const level2 = [];
  for (let i = 0; i < level1.length; i += 2) {
    level2.push(hash2(level1[i], level1[i + 1]));
  }

  const root = hash2(level2[0], level2[1]);

  const chosenIndex = 2;
  const secret = voterSecrets[chosenIndex];
  const vote = 2n;

  const nullifierHash = hash2(secret, electionId);

  const pathElements = [
    commitments[3],
    level1[0],
    level2[1]
  ];

  const pathIndices = [0, 1, 0];

  const input = {
    secret: secret.toString(),
    electionId: electionId.toString(),
    vote: vote.toString(),
    root: root.toString(),
    nullifierHash: nullifierHash.toString(),
    pathElements: pathElements.map((x) => x.toString()),
    pathIndices: pathIndices.map((x) => x.toString()),
    isVote1: "0",
    isVote2: "1",
    isVote3: "0"
  };

  fs.writeFileSync("inputs/input.json", JSON.stringify(input, null, 2));

  console.log("Input written to inputs/input.json");
  console.log("Root:", root.toString());
  console.log("Nullifier:", nullifierHash.toString());
}

main().catch(console.error);