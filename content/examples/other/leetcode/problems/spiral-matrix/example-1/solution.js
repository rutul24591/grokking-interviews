function spiralOrderVisited(matrix) {
  const rows = matrix.length;
  const cols = rows === 0 ? 0 : matrix[0].length;
  const visited = Array.from({ length: rows }, () => new Array(cols).fill(false));
  const out = [];
  const dirs = [
    [0, 1],
    [1, 0],
    [0, -1],
    [-1, 0],
  ];
  let dir = 0;
  let r = 0;
  let c = 0;

  for (let step = 0; step < rows * cols; step += 1) {
    out.push(matrix[r][c]);
    visited[r][c] = true;
    const [dr, dc] = dirs[dir];
    const nr = r + dr;
    const nc = c + dc;
    if (nr < 0 || nc < 0 || nr >= rows || nc >= cols || visited[nr][nc]) dir = (dir + 1) % 4;
    const [ndr, ndc] = dirs[dir];
    r += ndr;
    c += ndc;
  }

  return out;
}

if (require.main === module) {
  console.log(spiralOrderVisited([[1, 2, 3], [4, 5, 6], [7, 8, 9]]));
}

module.exports = { spiralOrderVisited };
