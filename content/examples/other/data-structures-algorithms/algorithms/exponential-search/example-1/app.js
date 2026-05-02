const { exponentialSearch } = require("./algorithm");

const index = [3, 6, 9, 12, 15, 18, 21];
console.log("exponentialSearch hit:", exponentialSearch(index, 15));
console.log("exponentialSearch miss:", exponentialSearch(index, 8));
