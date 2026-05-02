const { jumpSearch } = require("../example-1/algorithm");

console.log("Empty:", jumpSearch([], 1));
console.log("Singleton hit:", jumpSearch([5], 5));
console.log("Singleton miss:", jumpSearch([5], 1));

const unsorted = [3, 1, 2];
console.log("Unsorted result (invalid precondition):", jumpSearch(unsorted, 2));
console.log("Observation: ordered searches assume sorted, monotonic input.");
