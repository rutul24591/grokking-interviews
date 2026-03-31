function overlappingIntervals(events) {
  let active = 0;
  return events.map((event) => {
    if (event === "start") active += 1;
    if (event === "cleanup") active = Math.max(0, active - 1);
    return { event, overlapping: active > 1, active };
  });
}

console.log(overlappingIntervals(["start", "start", "cleanup"]));
