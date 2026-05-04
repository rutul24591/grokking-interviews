function canAttendMeetingsSort(intervals) {
  intervals.sort((a, b) => a[0] - b[0]);
  for (let i = 1; i < intervals.length; i += 1) {
    if (intervals[i][0] < intervals[i - 1][1]) return false;
  }
  return true;
}

if (require.main === module) {
  console.log(canAttendMeetingsSort([[0, 30], [5, 10], [15, 20]]));
  console.log(canAttendMeetingsSort([[7, 10], [2, 4]]));
}

module.exports = { canAttendMeetingsSort };
