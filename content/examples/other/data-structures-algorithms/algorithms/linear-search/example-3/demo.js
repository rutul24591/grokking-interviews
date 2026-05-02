const { linearSearch } = require("../example-1/algorithm");

console.log("Empty:", linearSearch([], 1));
console.log("Singleton hit:", linearSearch([5], 5));
console.log("Singleton miss:", linearSearch([5], 1));

const unsorted = [3, 1, 2];
console.log("Unsorted result (invalid precondition):", linearSearch(unsorted, 2));
console.log("Observation: ordered searches assume sorted, monotonic input.");
