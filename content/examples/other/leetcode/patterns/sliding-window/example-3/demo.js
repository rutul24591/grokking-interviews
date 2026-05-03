const { maxSumSubarrayK } = require("../example-1/pattern");

try { console.log(maxSumSubarrayK([], 3)); } catch (e) { console.log("empty:", e.message); }
try { console.log(maxSumSubarrayK([1,2,3], 0)); } catch (e) { console.log("k=0:", e.message); }
console.log("k>n:", maxSumSubarrayK([1, 2], 3));
