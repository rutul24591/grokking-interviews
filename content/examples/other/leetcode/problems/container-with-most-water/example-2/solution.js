function maxArea(height) {
  let left = 0;
  let right = height.length - 1;
  let best = 0;
  while (left < right) {
    const area = Math.min(height[left], height[right]) * (right - left);
    if (area > best) best = area;
    if (height[left] < height[right]) left += 1;
    else right -= 1;
  }
  return best;
}

if (require.main === module) {
  console.log(maxArea([1, 8, 6, 2, 5, 4, 8, 3, 7]));
}

module.exports = { maxArea };
