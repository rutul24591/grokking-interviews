function mergeIntervals(intervals) {
  // Same as example-1; for this problem, sorting is essentially required for an optimal merge.
  intervals.sort((a, b) => a[0] - b[0]);
  const out = [];
  for (const [s, e] of intervals) {
    if (out.length === 0 || s > out[out.length - 1][1]) out.push([s, e]);
    else out[out.length - 1][1] = Math.max(out[out.length - 1][1], e);
  }
  return out;
}

if (require.main === module) {
  console.log(mergeIntervals([[1, 3], [2, 6], [8, 10], [15, 18]]));
}

module.exports = { mergeIntervals };
