const fs = require("fs");
const circomlibjs = require("circomlibjs");

async function buildMerkleTree() {
  const poseidon = await circomlibjs.buildPoseidon();
  const F = poseidon.F;

  const votersPath = "./scripts/voters.json";
  const outputPath = "./scripts/merkle.json";

  const voters = JSON.parse(
    fs.readFileSync(votersPath, "utf8")
  );

  const TREE_DEPTH = 4;
const TREE_SIZE = 2 ** TREE_DEPTH;

// Validate voters
for (const voter of voters) {
  if (
    !voter.voterId ||
    voter.commitment === undefined ||
    voter.commitment === null
  ) {
    throw new Error(
      `Invalid voter data: ${JSON.stringify(voter)}`
    );
  }
}

// Get commitments as BigInts
const leaves = voters.map(
  voter => BigInt(voter.commitment)
);

// Prevent exceeding tree capacity
if (leaves.length > TREE_SIZE) {
  throw new Error(
    `Too many voters (${leaves.length}). ` +
    `Tree depth ${TREE_DEPTH} supports only ${TREE_SIZE} voters.`
  );
}

// Pad tree with zero leaves
while (leaves.length < TREE_SIZE) {
  leaves.push(0n);
}

  const levels = [leaves];

  // Build tree
  let currentLevel = leaves;

  for (let level = 0; level < TREE_DEPTH; level++) {
    const nextLevel = [];

    for (let i = 0; i < currentLevel.length; i += 2) {
      const left = currentLevel[i];
      const right = currentLevel[i + 1];

      const hash = F.toString(
        poseidon([left, right])
      );

      nextLevel.push(BigInt(hash));
    }

    levels.push(nextLevel);
    currentLevel = nextLevel;
  }

  const root = levels[TREE_DEPTH][0].toString();

  // Generate Merkle proof for every registered voter
  const voterProofs = voters.map((voter, index) => {
    let currentIndex = index;

    const pathElements = [];
    const pathIndices = [];

    for (let level = 0; level < TREE_DEPTH; level++) {
      const isRightNode = currentIndex % 2;

      pathIndices.push(isRightNode.toString());

      const siblingIndex = isRightNode
        ? currentIndex - 1
        : currentIndex + 1;

      pathElements.push(
        levels[level][siblingIndex].toString()
      );

      currentIndex = Math.floor(currentIndex / 2);
    }

    return {
      voterId: voter.voterId,
      commitment: voter.commitment,
      secretKey: voter.secretKey,
      pathElements,
      pathIndices,
      root
    };
  });

  const result = {
    root,
    depth: TREE_DEPTH,
    voters: voterProofs
  };

  fs.writeFileSync(
    outputPath,
    JSON.stringify(result, null, 2)
  );

  console.log("\n========== MERKLE TREE ==========");
  console.log("Tree depth :", TREE_DEPTH);
  console.log("Tree size  :", TREE_SIZE);
  console.log("Voters     :", voters.length);
  console.log("Merkle Root:", root);
  console.log("=================================\n");

  for (const voter of voterProofs) {
    console.log(voter.voterId);
    console.log("Path Elements:", voter.pathElements);
    console.log("Path Indices :", voter.pathIndices);
    console.log();
  }

  console.log(`Saved to ${outputPath}`);
}

buildMerkleTree().catch(console.error);