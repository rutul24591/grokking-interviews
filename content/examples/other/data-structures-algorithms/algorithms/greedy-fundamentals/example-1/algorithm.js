function selectActivities(activities) {
  const sorted = [...activities].sort((a, b) => a.end - b.end);
  const chosen = [];
  let lastEnd = -Infinity;
  for (const act of sorted) {
    if (act.start >= lastEnd) {
      chosen.push(act);
      lastEnd = act.end;
    }
  }
  return chosen;
}

module.exports = { selectActivities };
