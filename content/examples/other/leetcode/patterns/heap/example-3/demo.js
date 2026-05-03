const { kthLargest } = require("../example-1/pattern");
console.log("empty:", kthLargest([], 1));
console.log("ties:", kthLargest([5,5,5], 2));
console.log("note: validate k upfront; kthLargest([],k) should return null or throw per policy.");
