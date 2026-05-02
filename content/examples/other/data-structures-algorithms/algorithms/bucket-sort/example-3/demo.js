const { bucketSort } = require("../example-1/algorithm");

console.log("Empty:", bucketSort([]));
console.log("Single:", bucketSort([1]));
console.log("Duplicates:", bucketSort([2, 2, 2, 1]));
console.log("Already sorted:", bucketSort([1, 2, 3, 4]));
