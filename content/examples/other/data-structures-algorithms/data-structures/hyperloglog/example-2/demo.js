const { HyperLogLog } = require("../example-1/hyperloglog");

const left = new HyperLogLog();
const right = new HyperLogLog();
["u1", "u2", "u3"].forEach((user) => left.add(user));
["u3", "u4", "u5"].forEach((user) => right.add(user));

const mergedRegisters = left.registers.map((value, index) =>
  Math.max(value, right.registers[index]),
);

console.log("Left estimate:", left.estimate());
console.log("Right estimate:", right.estimate());
console.log("Merged registers:", mergedRegisters);
