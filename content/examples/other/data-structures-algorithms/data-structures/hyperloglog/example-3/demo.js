const { HyperLogLog } = require("../example-1/hyperloglog");

const hll = new HyperLogLog();
["a", "b"].forEach((value) => hll.add(value));

console.log("Exact unique count:", 2);
console.log("Approximate count:", hll.estimate());
console.log("Observation: small-cardinality bias is why many HLL implementations add correction logic.");
