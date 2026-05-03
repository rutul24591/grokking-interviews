function insertInterval(intervals, newInterval) {
  const out = [];
  let i = 0;
  while (i < intervals.length && intervals[i][1] < newInterval[0]) out.push(intervals[i++]);
  while (i < intervals.length && intervals[i][0] <= newInterval[1]) {
    newInterval = [Math.min(newInterval[0], intervals[i][0]), Math.max(newInterval[1], intervals[i][1])];
    i += 1;
  }
  out.push(newInterval);
  while (i < intervals.length) out.push(intervals[i++]);
  return out;
}

console.log(insertInterval([[1,3],[6,9]], [2,5]));
console.log(insertInterval([[1,2],[3,5],[6,7],[8,10],[12,16]], [4,8]));
