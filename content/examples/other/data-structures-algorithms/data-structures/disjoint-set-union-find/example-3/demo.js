const { UnionFind } = require("../example-1/union-find");

const uf = new UnionFind(["A", "B"]);
console.log("First union changed state:", uf.union("A", "B"));
console.log("Second union changed state:", uf.union("A", "B"));
console.log("Connected:", uf.connected("A", "B"));
console.log("Observation: production code should guard unknown nodes before calling find/union.");
