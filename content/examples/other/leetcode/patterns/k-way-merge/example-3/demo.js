const { mergeKSorted } = require("../example-1/pattern");
console.log("all empty:", mergeKSorted([[],[]]));
console.log("dupes:", mergeKSorted([[1,1],[1]]));
console.log("note: define policy for kth queries when k > total elements.");
