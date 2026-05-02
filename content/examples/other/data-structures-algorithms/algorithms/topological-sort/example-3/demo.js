const { topoSort } = require("../example-1/algorithm");
const nodes = ["A", "B"];
const edges = [["A", "B"], ["B", "A"]];
console.log("Order:", topoSort(nodes, edges));
