function isValid(board, row, col, val) {
  for (let i = 0; i < 9; i += 1) {
    if (board[row][i] === val) return false;
    if (board[i][col] === val) return false;
  }
  const boxRow = Math.floor(row / 3) * 3;
  const boxCol = Math.floor(col / 3) * 3;
  for (let r = 0; r < 3; r += 1) {
    for (let c = 0; c < 3; c += 1) {
      if (board[boxRow + r][boxCol + c] === val) return false;
    }
  }
  return true;
}

function solve(board) {
  for (let row = 0; row < 9; row += 1) {
    for (let col = 0; col < 9; col += 1) {
      if (board[row][col] !== 0) continue;
      for (let val = 1; val <= 9; val += 1) {
        if (!isValid(board, row, col, val)) continue;
        board[row][col] = val;
        if (solve(board)) return true;
        board[row][col] = 0;
      }
      return false;
    }
  }
  return true;
}

module.exports = { solve };
