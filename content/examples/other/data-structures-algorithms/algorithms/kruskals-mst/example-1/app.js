const { kruskal } = require("./algorithm");
const nodes = ["A", "B", "C", "D"];
const edges = [
  { from: "A", to: "B", weight: 2 },
  { from: "A", to: "C", weight: 3 },
  { from: "B", to: "C", weight: 1 },
  { from: "B", to: "D", weight: 4 },
  { from: "C", to: "D", weight: 5 },
];
console.table(kruskal(nodes, edges));
