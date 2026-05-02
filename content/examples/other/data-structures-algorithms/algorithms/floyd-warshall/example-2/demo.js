const { floydWarshall } = require("../example-1/algorithm");
const nodes = ["A", "B"];
const edges = [
  { from: "A", to: "B", weight: -2 },
  { from: "B", to: "A", weight: -2 },
];
const dist = floydWarshall(nodes, edges);
console.log(dist);
console.log("Negative cycle?", dist[0][0] < 0 || dist[1][1] < 0);
