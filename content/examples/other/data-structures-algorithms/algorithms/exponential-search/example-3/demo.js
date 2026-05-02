const { exponentialSearch } = require("../example-1/algorithm");

console.log("Empty:", exponentialSearch([], 1));
console.log("Singleton hit:", exponentialSearch([5], 5));
console.log("Singleton miss:", exponentialSearch([5], 1));

const unsorted = [3, 1, 2];
console.log("Unsorted result (invalid precondition):", exponentialSearch(unsorted, 2));
console.log("Observation: ordered searches assume sorted, monotonic input.");
