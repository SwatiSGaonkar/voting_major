const fs = require("fs");
const circomlibjs = require("circomlibjs");

async function main() {
    const poseidon = await circomlibjs.buildPoseidon();
    const F = poseidon.F;

    // Get voter ID and candidate from command line
    const voterId = process.argv[2];
    const vote = BigInt(process.argv[3]);

    if (!voterId) {
        throw new Error(
            "Usage: node scripts/makeRealInput.js VOTER-0001 1"
        );
    }

    if (![1n, 2n, 3n].includes(vote)) {
        throw new Error("Vote must be 1, 2, or 3");
    }

    // Load Merkle tree
    const merkle = JSON.parse(
        fs.readFileSync("./scripts/merkle.json", "utf8")
    );

    // Find voter
    const voter = merkle.voters.find(
        v => v.voterId === voterId
    );

    if (!voter) {
        throw new Error(
            `${voterId} not found in merkle.json`
        );
    }

    // Convert short secret key back to the number
   const secret = BigInt(
    "0x" +
    Buffer.from(voter.secretKey, "utf8").toString("hex")
);

    const electionId = 1n;

    // Generate nullifier
    const nullifierHash = F.toString(
        poseidon([secret, electionId])
    );

    // Prepare circuit input
    const input = {
        secret: secret.toString(),
        electionId: electionId.toString(),
        vote: vote.toString(),

        pathElements: voter.pathElements,
        pathIndices: voter.pathIndices,

        root: merkle.root,
        nullifierHash,

        isVote1: vote === 1n ? "1" : "0",
        isVote2: vote === 2n ? "1" : "0",
        isVote3: vote === 3n ? "1" : "0"
    };

    // Save input
    fs.writeFileSync(
        "./circuits/input.json",
        JSON.stringify(input, null, 2)
    );

    console.log("\n========== ZKP INPUT ==========");
    console.log("Voter       :", voter.voterId);
    console.log("Secret Key  :", voter.secretKey);
    console.log("Election    :", electionId.toString());
    console.log("Vote        :", vote.toString());
    console.log("Commitment  :", voter.commitment);
    console.log("Merkle Root :", merkle.root);
    console.log("Nullifier   :", nullifierHash);
    console.log("================================");

    console.log("\ninput.json created successfully.");
}

main().catch(error => {
    console.error("\nERROR:", error.message);
});