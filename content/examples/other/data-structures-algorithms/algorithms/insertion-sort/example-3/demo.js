const { insertionSort } = require("../example-1/algorithm");

console.log("Empty:", insertionSort([]));
console.log("Single:", insertionSort([1]));
console.log("Duplicates:", insertionSort([2, 2, 2, 1]));
console.log("Already sorted:", insertionSort([1, 2, 3, 4]));
