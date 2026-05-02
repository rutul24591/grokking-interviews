const { binarySearch } = require("../example-1/algorithm");

console.log("Empty:", binarySearch([], 1));
console.log("Singleton hit:", binarySearch([5], 5));
console.log("Singleton miss:", binarySearch([5], 1));

const unsorted = [3, 1, 2];
console.log("Unsorted result (invalid precondition):", binarySearch(unsorted, 2));
console.log("Observation: ordered searches assume sorted, monotonic input.");
