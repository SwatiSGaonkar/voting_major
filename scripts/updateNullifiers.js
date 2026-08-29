const fs = require("fs");
const circomlibjs = require("circomlibjs");

async function main() {
  const poseidon = await circomlibjs.buildPoseidon();
  const F = poseidon.F;

  const filePath = "./scripts/merkle.json";

  if (!fs.existsSync(filePath)) {
    throw new Error("scripts/merkle.json not found");
  }

  const merkle = JSON.parse(
    fs.readFileSync(filePath, "utf8")
  );

  const electionId = 1n;

  for (const voter of merkle.voters) {
    // IMPORTANT:
    // This is the SAME secret conversion used
    // in registerVoter.js
    const secret = BigInt(
      "0x" +
        Buffer.from(
          voter.secretKey,
          "utf8"
        ).toString("hex")
    );

    const nullifierHash = F.toString(
      poseidon([
        secret,
        electionId
      ])
    );

    voter.nullifierHash = nullifierHash;

    console.log(
      `${voter.voterId} -> ${nullifierHash}`
    );
  }

  merkle.electionId =
    electionId.toString();

  fs.writeFileSync(
    filePath,
    JSON.stringify(merkle, null, 2)
  );

  console.log(
    "\nNullifiers updated successfully."
  );
}

main().catch((error) => {
  console.error(
    "\nERROR:",
    error.message
  );
});