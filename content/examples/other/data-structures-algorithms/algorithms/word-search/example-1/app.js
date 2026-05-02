const { exists } = require("./algorithm");
const board = [
  ["A","B","C","E"],
  ["S","F","C","S"],
  ["A","D","E","E"],
];
console.log(exists(board, "ABCCED"));
console.log(exists(board, "SEE"));
console.log(exists(board, "ABCB"));
