const { interpolationSearch } = require("./algorithm");

const index = [3, 6, 9, 12, 15, 18, 21];
console.log("interpolationSearch hit:", interpolationSearch(index, 15));
console.log("interpolationSearch miss:", interpolationSearch(index, 8));
