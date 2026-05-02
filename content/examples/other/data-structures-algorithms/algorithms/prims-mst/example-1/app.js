const { primMst } = require("./algorithm");
const graph = {
  A: [{ to: "B", weight: 2 }, { to: "C", weight: 3 }],
  B: [{ to: "A", weight: 2 }, { to: "C", weight: 1 }, { to: "D", weight: 4 }],
  C: [{ to: "A", weight: 3 }, { to: "B", weight: 1 }, { to: "D", weight: 5 }],
  D: [{ to: "B", weight: 4 }, { to: "C", weight: 5 }],
};
console.table(primMst(graph, "A"));
