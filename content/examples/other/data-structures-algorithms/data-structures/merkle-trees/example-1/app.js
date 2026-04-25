const { buildMerkleRoot } = require("./merkle");

const chunks = ["chunk-a", "chunk-b", "chunk-c", "chunk-d"];
const cleanRoot = buildMerkleRoot(chunks);
const tamperedRoot = buildMerkleRoot(["chunk-a", "chunk-b", "chunk-X", "chunk-d"]);

console.log("Clean root:", cleanRoot);
console.log("Tampered root:", tamperedRoot);
console.log("Roots equal?", cleanRoot === tamperedRoot);
