const { buildPrefix, rangeSum } = require("./pattern");
const nums = [3, -2, 5, 1, 6];
const prefix = buildPrefix(nums);
console.log("sum 0..2:", rangeSum(prefix, 0, 2));
console.log("sum 2..4:", rangeSum(prefix, 2, 4));
