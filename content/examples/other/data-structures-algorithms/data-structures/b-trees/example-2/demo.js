const { BTree } = require("../example-1/btree");

const tree = new BTree(3);
[1, 2, 3, 4].forEach((value) => tree.insert(value));

console.log("Root after split:", tree.root.keys);
console.log("Children after split:", tree.root.children.map((child) => child.keys));
