function mergeIntervalsSort(intervals) {
  intervals.sort((a, b) => a[0] - b[0]);
  const merged = [];
  for (const [start, end] of intervals) {
    if (merged.length === 0 || start > merged[merged.length - 1][1]) merged.push([start, end]);
    else merged[merged.length - 1][1] = Math.max(merged[merged.length - 1][1], end);
  }
  return merged;
}

if (require.main === module) {
  console.log(mergeIntervalsSort([[1, 3], [2, 6], [8, 10], [15, 18]]));
}

module.exports = { mergeIntervalsSort };
