const { Graph } = require("../example-1/graph");

const graph = new Graph();
graph.addEdge("A", "B");
graph.addEdge("B", "C");

console.log("A -> C:", graph.shortestPath("A", "C"));
console.log("A -> Z:", graph.shortestPath("A", "Z"));

const adjacency = { A: ["B"], B: ["C"], C: ["A"] };
const visiting = new Set();
const visited = new Set();

function hasCycle(node) {
  if (visiting.has(node)) return true;
  if (visited.has(node)) return false;
  visiting.add(node);
  for (const neighbor of adjacency[node] ?? []) {
    if (hasCycle(neighbor)) return true;
  }
  visiting.delete(node);
  visited.add(node);
  return false;
}

console.log("Directed cycle present:", hasCycle("A"));
