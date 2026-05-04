function rotate(matrix) {
  const n = matrix.length;
  // transpose
  for (let r = 0; r < n; r += 1) {
    for (let c = r + 1; c < n; c += 1) {
      [matrix[r][c], matrix[c][r]] = [matrix[c][r], matrix[r][c]];
    }
  }
  // reverse rows
  for (let r = 0; r < n; r += 1) matrix[r].reverse();
  return matrix;
}

if (require.main === module) {
  console.log(rotate([[1, 2, 3], [4, 5, 6], [7, 8, 9]]));
}

module.exports = { rotate };
