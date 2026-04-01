function scoreByOverlap(currentTags, candidateTags) {
  const current = new Set(currentTags);
  return candidateTags.filter((tag) => current.has(tag)).length;
}
console.log(scoreByOverlap(['search', 'ranking', 'latency'], ['ranking', 'experiments', 'latency']));
