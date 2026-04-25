const { buildMerkleRoot } = require("../example-1/merkle");

const oddRoot = buildMerkleRoot(["a", "b", "c"]);
const updatedRoot = buildMerkleRoot(["a", "b", "c-updated"]);

console.log("Odd leaf root:", oddRoot);
console.log("Updated leaf root:", updatedRoot);
console.log("Observation: only one branch changes logically, but the root still changes globally.");
