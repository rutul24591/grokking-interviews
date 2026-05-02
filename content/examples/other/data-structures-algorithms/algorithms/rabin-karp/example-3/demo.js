const { rabinKarp } = require("../example-1/algorithm");
console.log("Empty pattern:", rabinKarp("abc", ""));
console.log("Long pattern:", rabinKarp("abc", "abcd"));
console.log("Unicode:", rabinKarp("café", "fé"));
