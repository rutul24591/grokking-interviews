const { dijkstra } = require("../example-1/algorithm");
const graph = { A: [{ to: "B", weight: 1 }], B: [], C: [] };
console.log(dijkstra(graph, "A"));
