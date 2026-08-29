const fs = require("fs");
const circomlibjs = require("circomlibjs");

async function main() {
  const poseidon = await circomlibjs.buildPoseidon();
  const F = poseidon.F;

  const merklePath = "scripts/merkle.json";
  const outputPath = "client/public/voterProofData.json";

  const merkle = JSON.parse(
    fs.readFileSync(merklePath, "utf8")
  );

  const electionId = 1n;

  const voters = merkle.voters.map((voter) => {

    // SAME secret conversion used by registerVoter.js
    const secret = BigInt(
      "0x" +
      Buffer.from(
        voter.secretKey,
        "utf8"
      ).toString("hex")
    );

    // Generate nullifier from secret + election ID
    const nullifierHash = F.toString(
      poseidon([
        secret,
        electionId
      ])
    );

    return {
      voterId: voter.voterId,
      commitment: voter.commitment,
      pathElements: voter.pathElements,
      pathIndices: voter.pathIndices,
      root: voter.root,
      nullifierHash
    };
  });

  const voterProofData = {
    root: merkle.root,
    depth: merkle.depth,
    electionId: electionId.toString(),
    voters
  };

  fs.writeFileSync(
    outputPath,
    JSON.stringify(voterProofData, null, 2)
  );

  console.log("✅ voterProofData.json updated");
  console.log("Voters:", voters.length);
  console.log("Root:", voterProofData.root);

  console.log("\n========== NULLIFIERS ==========");

  for (const voter of voters) {
    console.log(
      `${voter.voterId} -> ${voter.nullifierHash}`
    );
  }

  console.log("================================");
}

main().catch((error) => {
  console.error("\nERROR:", error.message);
});