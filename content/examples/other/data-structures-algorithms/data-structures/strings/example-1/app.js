const { normalize, tokenize, canonicalKey } = require("./pipeline");

const input = "  Distributed   CACHE   Invalidation ";

console.log("Normalized:", normalize(input));
console.log("Tokens:", tokenize(input));
console.log("Cache key:", canonicalKey(input));
