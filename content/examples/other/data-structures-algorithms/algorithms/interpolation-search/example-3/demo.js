const { interpolationSearch } = require("../example-1/algorithm");

console.log("Empty:", interpolationSearch([], 1));
console.log("Singleton hit:", interpolationSearch([5], 5));
console.log("Singleton miss:", interpolationSearch([5], 1));

const unsorted = [3, 1, 2];
console.log("Unsorted result (invalid precondition):", interpolationSearch(unsorted, 2));
console.log("Observation: ordered searches assume sorted, monotonic input.");
