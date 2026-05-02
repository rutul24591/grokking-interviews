const { radixSort } = require("./algorithm");

const numbers = [7, 2, 9, 2, 1, 8, 3];
console.log("radixSort numbers:", radixSort(numbers));

const telemetry = [
  { id: "r1", latencyMs: 180 },
  { id: "r2", latencyMs: 95 },
  { id: "r3", latencyMs: 140 },
  { id: "r4", latencyMs: 95 },
];
console.log('Note: object sorting not applicable for this numeric-only sort.');
