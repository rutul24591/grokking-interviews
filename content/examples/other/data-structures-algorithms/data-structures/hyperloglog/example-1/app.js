const { HyperLogLog } = require("./hyperloglog");

const hll = new HyperLogLog();
[
  "u1",
  "u2",
  "u3",
  "u1",
  "u4",
  "u5",
  "u2",
  "u6",
].forEach((user) => hll.add(user));

console.log("Registers:", hll.registers);
console.log("Estimated uniques:", hll.estimate());
