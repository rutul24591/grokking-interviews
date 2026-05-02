const { floydWarshall } = require("./algorithm");
const nodes = ["A", "B", "C"];
const edges = [
  { from: "A", to: "B", weight: 2 },
  { from: "B", to: "C", weight: 3 },
  { from: "A", to: "C", weight: 10 },
];
console.log(floydWarshall(nodes, edges));
