const { mergeSort } = require("../example-1/algorithm");

console.log("Empty:", mergeSort([]));
console.log("Single:", mergeSort([1]));
console.log("Duplicates:", mergeSort([2, 2, 2, 1]));
console.log("Already sorted:", mergeSort([1, 2, 3, 4]));
