const { binarySearch } = require("./algorithm");

const index = [3, 6, 9, 12, 15, 18, 21];
console.log("binarySearch hit:", binarySearch(index, 15));
console.log("binarySearch miss:", binarySearch(index, 8));
