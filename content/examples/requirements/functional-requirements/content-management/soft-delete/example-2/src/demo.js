function withinRecoveryWindow(daysSinceDelete, purgeWindowDays, legalHold) {
  return {
    recoverable: legalHold || daysSinceDelete < purgeWindowDays,
    daysRemaining: legalHold ? Infinity : Math.max(purgeWindowDays - daysSinceDelete, 0)
  };
}

console.log(withinRecoveryWindow(12, 30, false));
