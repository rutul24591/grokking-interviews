function setZeroesWithSets(matrix) {
  const rows = matrix.length;
  const cols = rows === 0 ? 0 : matrix[0].length;
  const zeroRows = new Set();
  const zeroCols = new Set();

  for (let r = 0; r < rows; r += 1) {
    for (let c = 0; c < cols; c += 1) {
      if (matrix[r][c] === 0) {
        zeroRows.add(r);
        zeroCols.add(c);
      }
    }
  }

  for (let r = 0; r < rows; r += 1) {
    for (let c = 0; c < cols; c += 1) {
      if (zeroRows.has(r) || zeroCols.has(c)) matrix[r][c] = 0;
    }
  }
  return matrix;
}

if (require.main === module) {
  console.log(setZeroesWithSets([[1, 1, 1], [1, 0, 1], [1, 1, 1]]));
}

module.exports = { setZeroesWithSets };
