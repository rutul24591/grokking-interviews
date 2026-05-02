const { kmpSearch } = require("../example-1/algorithm");
console.log("Overlap match:", kmpSearch("aaaaaa", "aaaa"));
console.log("Empty pattern:", kmpSearch("abc", ""));
