function eraseOverlapIntervalsSortStart(intervals) {
  intervals.sort((a, b) => a[0] - b[0]);
  let removed = 0;
  let prevEnd = intervals.length ? intervals[0][1] : 0;
  for (let i = 1; i < intervals.length; i += 1) {
    const [s, e] = intervals[i];
    if (s < prevEnd) {
      removed += 1;
      prevEnd = Math.min(prevEnd, e);
    } else {
      prevEnd = e;
    }
  }
  return removed;
}

if (require.main === module) {
  console.log(eraseOverlapIntervalsSortStart([[1, 2], [2, 3], [3, 4], [1, 3]]));
}

module.exports = { eraseOverlapIntervalsSortStart };
