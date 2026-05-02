function exists(board, word) {
  const rows = board.length;
  const cols = board[0].length;
  const visited = Array.from({ length: rows }, () => new Array(cols).fill(false));

  function dfs(r, c, i) {
    if (i === word.length) return true;
    if (r < 0 || c < 0 || r >= rows || c >= cols) return false;
    if (visited[r][c]) return false;
    if (board[r][c] !== word[i]) return false;
    visited[r][c] = true;
    const ok =
      dfs(r + 1, c, i + 1) ||
      dfs(r - 1, c, i + 1) ||
      dfs(r, c + 1, i + 1) ||
      dfs(r, c - 1, i + 1);
    visited[r][c] = false;
    return ok;
  }

  for (let r = 0; r < rows; r += 1) {
    for (let c = 0; c < cols; c += 1) {
      if (dfs(r, c, 0)) return true;
    }
  }
  return false;
}

module.exports = { exists };
