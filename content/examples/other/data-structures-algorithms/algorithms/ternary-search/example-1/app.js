const { ternarySearch } = require("./algorithm");

const index = [3, 6, 9, 12, 15, 18, 21];
console.log("ternarySearch hit:", ternarySearch(index, 15));
console.log("ternarySearch miss:", ternarySearch(index, 8));
