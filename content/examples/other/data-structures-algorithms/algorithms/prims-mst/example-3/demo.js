const { primMst } = require("../example-1/algorithm");
const graph = { A: [{ to: "B", weight: 1 }], B: [{ to: "A", weight: 1 }], C: [] };
console.table(primMst(graph, "A"));
console.log("Observation: C is disconnected, so MST is a forest.");
