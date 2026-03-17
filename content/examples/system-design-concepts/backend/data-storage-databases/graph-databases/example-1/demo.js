// Demonstrates traversal queries.

const { Graph } = require("./graph");

const graph = new Graph();

graph.addEdge("ada", "grace");
graph.addEdge("grace", "linus");
graph.addEdge("ada", "alan");
graph.addEdge("alan", "linus");

function friendsOfFriends(node) {
  const direct = new Set(graph.neighbors(node));
  const fof = new Set();
  for (const friend of direct) {
    for (const second of graph.neighbors(friend)) {
      if (second !== node && !direct.has(second)) {
        fof.add(second);
      }
    }
  }
  return Array.from(fof);
}

console.log("Friends of friends", friendsOfFriends("ada"));
