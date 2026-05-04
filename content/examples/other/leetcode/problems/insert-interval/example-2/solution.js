function insertInterval(intervals, newInterval) {
  // Same optimal linear scan; written with minimal temporary state.
  const out = [];
  let [ns, ne] = newInterval;
  for (const [s, e] of intervals) {
    if (e < ns) out.push([s, e]);
    else if (s > ne) {
      out.push([ns, ne]);
      ns = s;
      ne = e;
    } else {
      ns = Math.min(ns, s);
      ne = Math.max(ne, e);
    }
  }
  out.push([ns, ne]);
  return out;
}

if (require.main === module) {
  console.log(insertInterval([[1, 3], [6, 9]], [2, 5]));
}

module.exports = { insertInterval };
