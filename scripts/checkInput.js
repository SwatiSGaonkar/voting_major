const fs = require("fs");
const circomlibjs = require("circomlibjs");

async function main() {
    const poseidon = await circomlibjs.buildPoseidon();
    const F = poseidon.F;

    const input = JSON.parse(
        fs.readFileSync("./circuits/input.json", "utf8")
    );

    const merkle = JSON.parse(
        fs.readFileSync("./scripts/merkle.json", "utf8")
    );

    const voter = merkle.voters.find(
        v => v.voterId === "VOTER-0003"
    );

    if (!voter) {
        throw new Error("VOTER-0002 not found");
    }

    // Calculate commitment exactly like Vote.circom
    const calculatedCommitment = F.toString(
        poseidon([BigInt(input.secret)])
    );

    // Calculate nullifier exactly like Vote.circom
    const calculatedNullifier = F.toString(
        poseidon([
            BigInt(input.secret),
            BigInt(input.electionId)
        ])
    );

    console.log("\n========== INPUT CONSISTENCY CHECK ==========");

    console.log("\nSecret:");
    console.log(input.secret);

    console.log("\n--- COMMITMENT ---");

    console.log("Calculated from secret:");
    console.log(calculatedCommitment);

    console.log("\nVOTER-0002 commitment in merkle.json:");
    console.log(voter.commitment);

    if (calculatedCommitment === voter.commitment) {
        console.log("\n✅ COMMITMENT MATCHES");
    } else {
        console.log("\n❌ COMMITMENT DOES NOT MATCH");
    }

    console.log("\n--- NULLIFIER ---");

    console.log("Calculated from secret + electionId:");
    console.log(calculatedNullifier);

    console.log("\nnullifierHash in input.json:");
    console.log(input.nullifierHash);

    if (calculatedNullifier === input.nullifierHash) {
        console.log("\n✅ NULLIFIER MATCHES");
    } else {
        console.log("\n❌ NULLIFIER DOES NOT MATCH");
    }

    console.log("\n--- ROOT ---");

    console.log("Root in input.json:");
    console.log(input.root);

    console.log("\nRoot in merkle.json:");
    console.log(merkle.root);

    if (input.root === merkle.root) {
        console.log("\n✅ ROOT MATCHES");
    } else {
        console.log("\n❌ ROOT DOES NOT MATCH");
    }

    console.log("\n=============================================\n");
}

main().catch(console.error);