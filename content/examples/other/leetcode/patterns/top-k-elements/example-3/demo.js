const { topK } = require("../example-1/pattern");
console.log("dupes:", topK([5,5,5], 2));
console.log("k>n:", topK([1,2], 5));
console.log("note: validate k upstream; define policy for k>n.");
