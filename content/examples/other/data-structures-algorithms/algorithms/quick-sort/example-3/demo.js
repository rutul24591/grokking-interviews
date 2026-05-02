const { quickSort } = require("../example-1/algorithm");

console.log("Empty:", quickSort([]));
console.log("Single:", quickSort([1]));
console.log("Duplicates:", quickSort([2, 2, 2, 1]));
console.log("Already sorted:", quickSort([1, 2, 3, 4]));
