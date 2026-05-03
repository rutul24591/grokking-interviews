function mergeIntervals(intervals) {
  const sorted = [...intervals].sort((a, b) => a[0] - b[0]);
  const merged = [];
  for (const interval of sorted) {
    if (!merged.length || interval[0] > merged[merged.length - 1][1]) {
      merged.push([...interval]);
    } else {
      merged[merged.length - 1][1] = Math.max(merged[merged.length - 1][1], interval[1]);
    }
  }
  return merged;
}

module.exports = { mergeIntervals };
