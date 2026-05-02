const { topoSort } = require("./algorithm");
const nodes = ["schema", "api", "web", "worker"];
const edges = [
  ["schema", "api"],
  ["api", "web"],
  ["api", "worker"],
];
console.log("Order:", topoSort(nodes, edges));
