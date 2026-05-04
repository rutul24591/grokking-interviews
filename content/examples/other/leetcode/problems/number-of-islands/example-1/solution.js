function numIslandsMutatingDFS(grid) {
  const rows = grid.length;
  const cols = rows === 0 ? 0 : grid[0].length;
  let count = 0;

  function dfs(r, c) {
    if (r < 0 || c < 0 || r >= rows || c >= cols) return;
    if (grid[r][c] !== "1") return;
    grid[r][c] = "0";
    dfs(r + 1, c);
    dfs(r - 1, c);
    dfs(r, c + 1);
    dfs(r, c - 1);
  }

  for (let r = 0; r < rows; r += 1) {
    for (let c = 0; c < cols; c += 1) {
      if (grid[r][c] === "1") {
        count += 1;
        dfs(r, c);
      }
    }
  }
  return count;
}

if (require.main === module) {
  const grid = [
    ["1", "1", "0", "0", "0"],
    ["1", "1", "0", "0", "0"],
    ["0", "0", "1", "0", "0"],
    ["0", "0", "0", "1", "1"],
  ];
  console.log(numIslandsMutatingDFS(grid));
}

module.exports = { numIslandsMutatingDFS };
