function rotateImageExtraMatrix(matrix) {
  const n = matrix.length;
  const out = Array.from({ length: n }, () => new Array(n).fill(0));
  for (let r = 0; r < n; r += 1) {
    for (let c = 0; c < n; c += 1) out[c][n - 1 - r] = matrix[r][c];
  }
  for (let r = 0; r < n; r += 1) {
    for (let c = 0; c < n; c += 1) matrix[r][c] = out[r][c];
  }
  return matrix;
}

if (require.main === module) {
  console.log(rotateImageExtraMatrix([[1, 2, 3], [4, 5, 6], [7, 8, 9]]));
}

module.exports = { rotateImageExtraMatrix };
