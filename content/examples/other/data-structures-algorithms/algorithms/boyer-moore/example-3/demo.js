const { boyerMoore } = require("../example-1/algorithm");
console.log("Empty pattern:", boyerMoore("abc", ""));
console.log("Long pattern:", boyerMoore("abc", "abcd"));
console.log("Overlap:", boyerMoore("aaaaaa", "aaaa"));
