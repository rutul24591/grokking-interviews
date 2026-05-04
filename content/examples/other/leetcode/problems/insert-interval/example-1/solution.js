function insertIntervalLinear(intervals, newInterval) {
  const out = [];
  let [ns, ne] = newInterval;
  let i = 0;

  while (i < intervals.length && intervals[i][1] < ns) {
    out.push(intervals[i]);
    i += 1;
  }

  while (i < intervals.length && intervals[i][0] <= ne) {
    ns = Math.min(ns, intervals[i][0]);
    ne = Math.max(ne, intervals[i][1]);
    i += 1;
  }
  out.push([ns, ne]);

  while (i < intervals.length) {
    out.push(intervals[i]);
    i += 1;
  }

  return out;
}

if (require.main === module) {
  console.log(insertIntervalLinear([[1, 3], [6, 9]], [2, 5]));
}

module.exports = { insertIntervalLinear };
