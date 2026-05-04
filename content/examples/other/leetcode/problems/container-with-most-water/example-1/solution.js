function maxAreaBrute(height) {
  let best = 0;
  for (let i = 0; i < height.length; i += 1) {
    for (let j = i + 1; j < height.length; j += 1) {
      const area = Math.min(height[i], height[j]) * (j - i);
      if (area > best) best = area;
    }
  }
  return best;
}

if (require.main === module) {
  console.log(maxAreaBrute([1, 8, 6, 2, 5, 4, 8, 3, 7]));
}

module.exports = { maxAreaBrute };
