const { buildTree, buildCodes } = require("../example-1/algorithm");
console.log("Single symbol:", buildCodes(buildTree({ x: 10 })));
console.log("Tie case:", buildCodes(buildTree({ a: 1, b: 1, c: 1 })));
