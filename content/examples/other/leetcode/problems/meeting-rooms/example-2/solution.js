function canAttendMeetingsTwoArrays(intervals) {
  const starts = intervals.map((i) => i[0]).sort((a, b) => a - b);
  const ends = intervals.map((i) => i[1]).sort((a, b) => a - b);
  for (let i = 1; i < starts.length; i += 1) {
    if (starts[i] < ends[i - 1]) return false;
  }
  return true;
}

if (require.main === module) {
  console.log(canAttendMeetingsTwoArrays([[0, 30], [5, 10], [15, 20]]));
  console.log(canAttendMeetingsTwoArrays([[7, 10], [2, 4]]));
}

module.exports = { canAttendMeetingsTwoArrays };
