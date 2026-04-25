const { Graph } = require("./graph");

const graph = new Graph();
graph.addEdge("api-gateway", "auth-service");
graph.addEdge("api-gateway", "catalog-service");
graph.addEdge("catalog-service", "search-index");
graph.addEdge("auth-service", "session-store");
graph.addEdge("search-index", "analytics-pipeline");

console.log(
  "Path api-gateway -> analytics-pipeline:",
  graph.shortestPath("api-gateway", "analytics-pipeline"),
);
