const fs = require("fs");
const circomlibjs = require("circomlibjs");

async function main() {
    const poseidon = await circomlibjs.buildPoseidon();
    const F = poseidon.F;

    const merkle = JSON.parse(
        fs.readFileSync("./scripts/merkle.json", "utf8")
    );

    if (!merkle.voters || merkle.voters.length === 0) {
        throw new Error("No voters found in merkle.json");
    }

    console.log("\n========== MERKLE TREE CHECK ==========");
    console.log("Total voters:", merkle.voters.length);
    console.log("Expected root:", merkle.root);
    console.log("=======================================\n");

    let validCount = 0;

    for (const voter of merkle.voters) {
        let hash = BigInt(voter.commitment);

        console.log(`Checking ${voter.voterId}...`);

        for (let i = 0; i < voter.pathElements.length; i++) {
            const sibling = BigInt(voter.pathElements[i]);
            const index = Number(voter.pathIndices[i]);

            let left;
            let right;

            if (index === 0) {
                left = hash;
                right = sibling;
            } else {
                left = sibling;
                right = hash;
            }

            hash = BigInt(
                F.toString(poseidon([left, right]))
            );
        }

        if (hash.toString() === merkle.root) {
            console.log(`✅ ${voter.voterId} - VALID`);
            validCount++;
        } else {
            console.log(`❌ ${voter.voterId} - INVALID`);
            console.log("   Calculated:", hash.toString());
            console.log("   Expected  :", merkle.root);
        }

        console.log();
    }

    console.log("========== FINAL RESULT ==========");
    console.log(`Valid voters: ${validCount}/${merkle.voters.length}`);

    if (validCount === merkle.voters.length) {
        console.log("✅ ALL MERKLE PROOFS ARE VALID");
    } else {
        console.log("❌ SOME MERKLE PROOFS ARE INVALID");
    }

    console.log("==================================\n");
}

main().catch(console.error);