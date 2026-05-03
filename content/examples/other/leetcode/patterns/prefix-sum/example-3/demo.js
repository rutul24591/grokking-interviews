const { buildPrefix, rangeSum } = require("../example-1/pattern");
const prefix = buildPrefix([]);
try { console.log(rangeSum(prefix, 0, 0)); } catch (e) { console.log("bad range"); }
console.log("note: use 64-bit prefix sums in languages with integer overflow.");
