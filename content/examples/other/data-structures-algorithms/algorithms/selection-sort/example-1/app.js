const { selectionSort } = require("./algorithm");

const numbers = [7, 2, 9, 2, 1, 8, 3];
console.log("selectionSort numbers:", selectionSort(numbers));

const telemetry = [
  { id: "r1", latencyMs: 180 },
  { id: "r2", latencyMs: 95 },
  { id: "r3", latencyMs: 140 },
  { id: "r4", latencyMs: 95 },
];

const sorted = selectionSort(telemetry, (a, b) => a.latencyMs - b.latencyMs);
console.table(sorted);
