function spiralOrder(matrix) {
  const out = [];
  let top = 0;
  let bottom = matrix.length - 1;
  let left = 0;
  let right = matrix.length === 0 ? -1 : matrix[0].length - 1;

  while (top <= bottom && left <= right) {
    for (let c = left; c <= right; c += 1) out.push(matrix[top][c]);
    top += 1;
    for (let r = top; r <= bottom; r += 1) out.push(matrix[r][right]);
    right -= 1;
    if (top <= bottom) {
      for (let c = right; c >= left; c -= 1) out.push(matrix[bottom][c]);
      bottom -= 1;
    }
    if (left <= right) {
      for (let r = bottom; r >= top; r -= 1) out.push(matrix[r][left]);
      left += 1;
    }
  }

  return out;
}

if (require.main === module) {
  console.log(spiralOrder([[1, 2, 3], [4, 5, 6], [7, 8, 9]]));
}

module.exports = { spiralOrder };
