const { HyperLogLog } = require("../example-1/hyperloglog");

function feed(sketch, count) {
  for (let i = 0; i < count; i += 1) sketch.add(`user-${i}`);
}

const lowPrecision = new HyperLogLog(3);
const highPrecision = new HyperLogLog(5);

feed(lowPrecision, 200);
feed(highPrecision, 200);

console.log("Exact uniques:", 200);
console.log("Low precision registers:", lowPrecision.registers.length, "estimate:", lowPrecision.estimate());
console.log("High precision registers:", highPrecision.registers.length, "estimate:", highPrecision.estimate());
