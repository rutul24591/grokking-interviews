function nQueens(n) {
  const cols = new Set();
  const diag1 = new Set();
  const diag2 = new Set();
  const board = new Array(n).fill(-1);

  function place(row) {
    if (row === n) return true;
    for (let col = 0; col < n; col += 1) {
      const d1 = row - col;
      const d2 = row + col;
      if (cols.has(col) || diag1.has(d1) || diag2.has(d2)) continue;
      cols.add(col);
      diag1.add(d1);
      diag2.add(d2);
      board[row] = col;
      if (place(row + 1)) return true;
      cols.delete(col);
      diag1.delete(d1);
      diag2.delete(d2);
      board[row] = -1;
    }
    return false;
  }

  return place(0) ? board : null;
}

module.exports = { nQueens };
