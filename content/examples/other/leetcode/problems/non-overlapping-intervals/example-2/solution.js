function eraseOverlapIntervalsSortEnd(intervals) {
  intervals.sort((a, b) => a[1] - b[1]);
  let kept = 0;
  let prevEnd = -Infinity;
  for (const [s, e] of intervals) {
    if (s >= prevEnd) {
      kept += 1;
      prevEnd = e;
    }
  }
  return intervals.length - kept;
}

if (require.main === module) {
  console.log(eraseOverlapIntervalsSortEnd([[1, 2], [2, 3], [3, 4], [1, 3]]));
}

module.exports = { eraseOverlapIntervalsSortEnd };
