const { linearSearch } = require("./algorithm");

const index = [3, 6, 9, 12, 15, 18, 21];
console.log("linearSearch hit:", linearSearch(index, 15));
console.log("linearSearch miss:", linearSearch(index, 8));
