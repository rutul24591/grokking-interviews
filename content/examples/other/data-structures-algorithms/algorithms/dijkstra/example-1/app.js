const { dijkstra } = require("./algorithm");

const graph = {
  A: [{ to: "B", weight: 2 }, { to: "C", weight: 5 }],
  B: [{ to: "C", weight: 1 }, { to: "D", weight: 4 }],
  C: [{ to: "D", weight: 1 }],
  D: [],
};

console.log("Distances from A:", dijkstra(graph, "A"));
