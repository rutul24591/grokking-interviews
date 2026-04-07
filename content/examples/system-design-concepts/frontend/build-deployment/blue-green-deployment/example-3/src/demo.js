function detectBlueGreenCutoverRisk(state) {
  const blockers = [];

  if (state.cutoverInProgress && !state.blueStillWarm) blockers.push("rollback-target-cold");
  if (state.sessionStickinessMismatch) blockers.push("users-may-bounce-between-blue-and-green");
  if (state.kpiRegression && !state.rollbackButtonVisible) blockers.push("operator-cannot-revert-fast-enough");
  if (state.greenDatabaseWrites && !state.rollbackWriteIsolation) blockers.push("rollback-may-leave-data-split-across-stacks");

  return {
    id: state.id,
    healthy: blockers.length === 0,
    blockers,
    repair: blockers.length === 0 ? "healthy" : "route-traffic-back-to-blue-and-quarantine-green"
  };
}

const cutovers = [
  { id: "healthy", cutoverInProgress: true, blueStillWarm: true, sessionStickinessMismatch: false, kpiRegression: false, rollbackButtonVisible: true, greenDatabaseWrites: false, rollbackWriteIsolation: true },
  { id: "split-brain-risk", cutoverInProgress: true, blueStillWarm: false, sessionStickinessMismatch: true, kpiRegression: true, rollbackButtonVisible: false, greenDatabaseWrites: true, rollbackWriteIsolation: false }
];

console.log(cutovers.map(detectBlueGreenCutoverRisk));
