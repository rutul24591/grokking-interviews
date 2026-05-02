const { bellmanFord } = require("../example-1/algorithm");

const nodes = ["A", "B", "C"];
const edges = [
  { from: "A", to: "B", weight: 1 },
  { from: "B", to: "C", weight: -2 },
  { from: "C", to: "B", weight: -2 },
];

console.log(bellmanFord(nodes, edges, "A"));
