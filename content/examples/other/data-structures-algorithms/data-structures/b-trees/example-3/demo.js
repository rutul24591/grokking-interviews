const { BTree } = require("../example-1/btree");

const tree = new BTree(4);
[8, 8, 4].forEach((value) => tree.insert(value));

console.log("Leaf-only root keys:", tree.root.keys);
console.log("Observation: duplicate-key policy is application-specific in many B-tree implementations.");
