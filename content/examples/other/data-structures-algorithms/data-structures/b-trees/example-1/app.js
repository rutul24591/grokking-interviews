const { BTree } = require("./btree");

const tree = new BTree(3);
[10, 20, 5, 6, 12, 30, 7, 17].forEach((value) => tree.insert(value));

console.log("Root keys:", tree.root.keys);
console.log("Child key ranges:", tree.root.children.map((child) => child.keys));
