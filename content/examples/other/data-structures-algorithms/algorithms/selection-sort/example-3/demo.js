const { selectionSort } = require("../example-1/algorithm");

console.log("Empty:", selectionSort([]));
console.log("Single:", selectionSort([1]));
console.log("Duplicates:", selectionSort([2, 2, 2, 1]));
console.log("Already sorted:", selectionSort([1, 2, 3, 4]));
