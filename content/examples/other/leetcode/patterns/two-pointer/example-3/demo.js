const { pairWithTargetSum } = require("../example-1/pattern");
console.log("empty:", pairWithTargetSum([], 10));
console.log("single:", pairWithTargetSum([5], 10));
console.log("unsorted (invalid):", pairWithTargetSum([3, 1, 2, 4], 5));
