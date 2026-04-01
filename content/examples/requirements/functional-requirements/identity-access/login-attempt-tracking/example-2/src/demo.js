function consecutiveFailures(results) {
  let streak = 0;
  for (const result of results) {
    if (result === 'success') break;
    if (result === 'failure') streak += 1;
  }
  return streak;
}

console.log(consecutiveFailures(['failure', 'failure', 'success']));
