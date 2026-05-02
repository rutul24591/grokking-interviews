const { ternarySearch } = require("../example-1/algorithm");

console.log("Empty:", ternarySearch([], 1));
console.log("Singleton hit:", ternarySearch([5], 5));
console.log("Singleton miss:", ternarySearch([5], 1));

const unsorted = [3, 1, 2];
console.log("Unsorted result (invalid precondition):", ternarySearch(unsorted, 2));
console.log("Observation: ordered searches assume sorted, monotonic input.");
