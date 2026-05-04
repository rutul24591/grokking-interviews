function minMeetingRoomsTwoArrays(intervals) {
  const starts = intervals.map((i) => i[0]).sort((a, b) => a - b);
  const ends = intervals.map((i) => i[1]).sort((a, b) => a - b);

  let rooms = 0;
  let endIndex = 0;
  for (let i = 0; i < starts.length; i += 1) {
    if (starts[i] < ends[endIndex]) rooms += 1;
    else endIndex += 1;
  }
  return rooms;
}

if (require.main === module) {
  console.log(minMeetingRoomsTwoArrays([[0, 30], [5, 10], [15, 20]]));
  console.log(minMeetingRoomsTwoArrays([[7, 10], [2, 4]]));
}

module.exports = { minMeetingRoomsTwoArrays };
