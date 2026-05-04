function setZeroes(matrix) {
  const rows = matrix.length;
  const cols = rows === 0 ? 0 : matrix[0].length;
  let firstRowZero = false;
  let firstColZero = false;

  for (let c = 0; c < cols; c += 1) if (matrix[0][c] === 0) firstRowZero = true;
  for (let r = 0; r < rows; r += 1) if (matrix[r][0] === 0) firstColZero = true;

  for (let r = 1; r < rows; r += 1) {
    for (let c = 1; c < cols; c += 1) {
      if (matrix[r][c] === 0) {
        matrix[r][0] = 0;
        matrix[0][c] = 0;
      }
    }
  }

  for (let r = 1; r < rows; r += 1) {
    for (let c = 1; c < cols; c += 1) {
      if (matrix[r][0] === 0 || matrix[0][c] === 0) matrix[r][c] = 0;
    }
  }

  if (firstRowZero) for (let c = 0; c < cols; c += 1) matrix[0][c] = 0;
  if (firstColZero) for (let r = 0; r < rows; r += 1) matrix[r][0] = 0;
  return matrix;
}

if (require.main === module) {
  console.log(setZeroes([[1, 1, 1], [1, 0, 1], [1, 1, 1]]));
}

module.exports = { setZeroes };
