const { shellSort } = require("../example-1/algorithm");

console.log("Empty:", shellSort([]));
console.log("Single:", shellSort([1]));
console.log("Duplicates:", shellSort([2, 2, 2, 1]));
console.log("Already sorted:", shellSort([1, 2, 3, 4]));
