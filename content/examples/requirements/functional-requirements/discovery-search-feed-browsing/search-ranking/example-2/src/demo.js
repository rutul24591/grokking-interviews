function meanReciprocalRank(rankings) {
  const score = rankings.reduce((sum, position) => sum + (position > 0 ? 1 / position : 0), 0);
  return Number((score / rankings.length).toFixed(3));
}

console.log(meanReciprocalRank([1, 2, 4]));
