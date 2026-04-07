function detectRollbackRisk(state) {
  const blockers = [];

  if (state.rollbackStarted && !state.assetManifestPinned) blockers.push("old-html-may-reference-missing-assets");
  if (state.rollbackStarted && state.cookiesIncompatible) blockers.push("users-may-lose-active-sessions");
  if (state.databaseWritesNeedCompensation && !state.compensationPlanReady) blockers.push("rollback-leaves-behind-incompatible-writes");
  if (state.operatorCanPurgeCacheBeforeTrafficShift) blockers.push("cache-purge-order-can-break-stable-release");

  return { id: state.id, healthy: blockers.length === 0, blockers };
}

const states = [
  { id: "healthy", rollbackStarted: true, assetManifestPinned: true, cookiesIncompatible: false, databaseWritesNeedCompensation: false, compensationPlanReady: true, operatorCanPurgeCacheBeforeTrafficShift: false },
  { id: "unsafe", rollbackStarted: true, assetManifestPinned: false, cookiesIncompatible: true, databaseWritesNeedCompensation: true, compensationPlanReady: false, operatorCanPurgeCacheBeforeTrafficShift: true }
];

console.log(states.map(detectRollbackRisk));
