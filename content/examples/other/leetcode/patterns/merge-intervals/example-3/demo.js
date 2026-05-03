const { mergeIntervals } = require("../example-1/pattern");
console.log("empty:", mergeIntervals([]));
console.log("nested:", mergeIntervals([[1,10],[2,3],[4,5]]));
console.log("touching:", mergeIntervals([[1,2],[2,3]]));
