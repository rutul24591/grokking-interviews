const { jumpSearch } = require("./algorithm");

const index = [3, 6, 9, 12, 15, 18, 21];
console.log("jumpSearch hit:", jumpSearch(index, 15));
console.log("jumpSearch miss:", jumpSearch(index, 8));
