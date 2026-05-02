const { countingSort } = require("../example-1/algorithm");

console.log("Empty:", countingSort([], 0));
console.log("Single:", countingSort([1], 1));
console.log("Duplicates:", countingSort([2, 2, 2, 1], 2));
console.log("Already sorted:", countingSort([1, 2, 3, 4], 4));
