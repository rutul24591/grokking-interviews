const { radixSort } = require("../example-1/algorithm");

console.log("Empty:", radixSort([]));
console.log("Single:", radixSort([1]));
console.log("Duplicates:", radixSort([2, 2, 2, 1]));
console.log("Already sorted:", radixSort([1, 2, 3, 4]));
