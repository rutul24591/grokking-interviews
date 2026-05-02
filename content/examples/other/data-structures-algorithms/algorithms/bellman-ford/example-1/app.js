const { bellmanFord } = require("./algorithm");

const nodes = ["A", "B", "C", "D"];
const edges = [
  { from: "A", to: "B", weight: 1 },
  { from: "B", to: "C", weight: -2 },
  { from: "A", to: "C", weight: 4 },
  { from: "C", to: "D", weight: 2 },
];

console.log(bellmanFord(nodes, edges, "A"));
