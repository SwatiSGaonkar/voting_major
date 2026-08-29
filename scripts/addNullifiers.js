const fs = require("fs");
const circomlibjs = require("circomlibjs");

async function main() {
  const poseidon = await circomlibjs.buildPoseidon();
  const F = poseidon.F;

  const merklePath = "./scripts/merkle.json";
  const outputPath = "./client/public/voterProofData.json";

  const merkle = JSON.parse(
    fs.readFileSync(merklePath, "utf8")
  );

  const electionId = 1n;

  const voters = merkle.voters.map((voter) => {
    // Convert the stored secret key exactly
    // the same way as makeRealInput.js
    const secretBytes = Buffer.from(
      voter.secretKey,
      "base64url"
    );

    const secret = BigInt(
      "0x" + secretBytes.toString("hex")
    );

    // Poseidon(secret, electionId)
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

  const output = {
    root: merkle.root,
    depth: merkle.depth,
    electionId: electionId.toString(),
    voters
  };

  fs.writeFileSync(
    outputPath,
    JSON.stringify(output, null, 2)
  );

  console.log(
    "\n========== NULLIFIERS GENERATED =========="
  );

  for (const voter of voters) {
    console.log(
      voter.voterId,
      "=>",
      voter.nullifierHash
    );
  }

  console.log(
    "=========================================="
  );

  console.log(
    `\nCreated: ${outputPath}`
  );
}

main().catch((error) => {
  console.error("\nERROR:", error);
});