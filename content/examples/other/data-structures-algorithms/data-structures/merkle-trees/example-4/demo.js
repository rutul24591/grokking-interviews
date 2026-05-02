const { sha } = require("../example-1/merkle");

function levelHashes(chunks) {
  const leaves = chunks.map((chunk) => sha(chunk));
  return {
    left: sha(leaves[0] + leaves[1]),
    right: sha(leaves[2] + leaves[3]),
    root: sha(sha(leaves[0] + leaves[1]) + sha(leaves[2] + leaves[3])),
  };
}

const a = levelHashes(["a", "b", "c", "d"]);
const b = levelHashes(["a", "b", "c", "X"]);

console.log("Roots equal?", a.root === b.root);
console.log("Left subtree equal?", a.left === b.left);
console.log("Right subtree equal?", a.right === b.right);
console.log("Observation: right subtree mismatch points you to leaves 2..3 as the diff range.");
