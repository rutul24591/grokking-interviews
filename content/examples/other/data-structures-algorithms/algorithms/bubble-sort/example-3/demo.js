const { bubbleSort } = require("../example-1/algorithm");

console.log("Empty:", bubbleSort([]));
console.log("Single:", bubbleSort([1]));
console.log("Duplicates:", bubbleSort([2, 2, 2, 1]));
console.log("Already sorted:", bubbleSort([1, 2, 3, 4]));
