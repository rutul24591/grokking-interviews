function diff(before, after) {
  return after.map((entry, index) => ({
    label: entry.label,
    delta: entry.retainedMb - before[index].retainedMb,
    suspicious: entry.retainedMb - before[index].retainedMb >= 5
  }));
}

console.log(diff(
  [{ label: "Feed cache", retainedMb: 16 }, { label: "Subscriptions", retainedMb: 8 }],
  [{ label: "Feed cache", retainedMb: 23 }, { label: "Subscriptions", retainedMb: 9 }]
));
