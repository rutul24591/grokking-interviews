const { buildTree, buildCodes } = require("./algorithm");
const freq = { a: 45, b: 13, c: 12, d: 16, e: 9, f: 5 };
const tree = buildTree(freq);
const codes = buildCodes(tree);
console.log(codes);
