pragma circom 2.0.0;

include "../node_modules/circomlib/circuits/poseidon.circom";

template MerkleTreeChecker(levels) {
    signal input leaf;
    signal input pathElements[levels];
    signal input pathIndices[levels];
    signal output root;

    signal hashes[levels + 1];
    signal left[levels];
    signal right[levels];

    signal leftPart1[levels];
    signal leftPart2[levels];
    signal rightPart1[levels];
    signal rightPart2[levels];

    component poseidons[levels];

    hashes[0] <== leaf;

    for (var i = 0; i < levels; i++) {
        pathIndices[i] * (pathIndices[i] - 1) === 0;

        leftPart1[i] <== (1 - pathIndices[i]) * hashes[i];
        leftPart2[i] <== pathIndices[i] * pathElements[i];
        left[i] <== leftPart1[i] + leftPart2[i];

        rightPart1[i] <== pathIndices[i] * hashes[i];
        rightPart2[i] <== (1 - pathIndices[i]) * pathElements[i];
        right[i] <== rightPart1[i] + rightPart2[i];

        poseidons[i] = Poseidon(2);
        poseidons[i].inputs[0] <== left[i];
        poseidons[i].inputs[1] <== right[i];

        hashes[i + 1] <== poseidons[i].out;
    }

    root <== hashes[levels];
}

template Vote(levels) {
    signal input secret;
    signal input electionId;
    signal input vote;

    signal input pathElements[levels];
    signal input pathIndices[levels];

    signal input root;
    signal input nullifierHash;

    signal output commitment;

    signal input isVote1;
    signal input isVote2;
    signal input isVote3;

    component commitmentHasher = Poseidon(1);
    commitmentHasher.inputs[0] <== secret;
    commitment <== commitmentHasher.out;

    component treeChecker = MerkleTreeChecker(levels);
    treeChecker.leaf <== commitment;

    for (var i = 0; i < levels; i++) {
        treeChecker.pathElements[i] <== pathElements[i];
        treeChecker.pathIndices[i] <== pathIndices[i];
    }

    treeChecker.root === root;

    component nullifierHasher = Poseidon(2);
    nullifierHasher.inputs[0] <== secret;
    nullifierHasher.inputs[1] <== electionId;
    nullifierHasher.out === nullifierHash;

    isVote1 * (isVote1 - 1) === 0;
    isVote2 * (isVote2 - 1) === 0;
    isVote3 * (isVote3 - 1) === 0;

    isVote1 + isVote2 + isVote3 === 1;

    vote === isVote1 * 1 + isVote2 * 2 + isVote3 * 3;
}

component main {public [root, nullifierHash, electionId]} = Vote(4);