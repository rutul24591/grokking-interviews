const { binarySearch } = require("../example-1/pattern");
console.log("empty:", binarySearch([], 1));
console.log("single hit:", binarySearch([5], 5));
console.log("unsorted (invalid):", binarySearch([3,1,2], 2));
