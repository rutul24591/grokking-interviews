const { nextGreaterElements } = require("../example-1/pattern");
console.log("empty:", nextGreaterElements([]));
console.log("inc:", nextGreaterElements([1,2,3]));
console.log("dec:", nextGreaterElements([3,2,1]));
console.log("dupes:", nextGreaterElements([2,2,2]));
