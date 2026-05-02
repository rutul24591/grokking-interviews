const { heapSort } = require("../example-1/algorithm");

console.log("Empty:", heapSort([]));
console.log("Single:", heapSort([1]));
console.log("Duplicates:", heapSort([2, 2, 2, 1]));
console.log("Already sorted:", heapSort([1, 2, 3, 4]));
