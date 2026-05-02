const { kruskal } = require("../example-1/algorithm");
console.table(
  kruskal(["A", "B", "C"], [{ from: "A", to: "B", weight: 1 }]),
);
console.log("Observation: node C is isolated, so the result is a forest.");
