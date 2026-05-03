const { shortestPath } = require("./pattern");
const graph = { A: ["B", "C"], B: ["D"], C: ["D"], D: ["E"], E: [] };
console.log(shortestPath(graph, "A", "E"));
console.log(shortestPath(graph, "A", "Z"));
