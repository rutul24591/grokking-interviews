function detectOfflineShellRisk(state) {
  const blockers = [];
  if (state.silentTakeover) blockers.push("worker-took-over-without-consent");
  if (!state.offlineShellVisible) blockers.push("offline-fallback-missing");
  if (!state.oldCachesPurged) blockers.push("stale-caches-not-purged");
  if (!state.reloadPromptVisible && state.waitingUpdate) blockers.push("waiting-update-hidden");
  return { id: state.id, healthy: blockers.length === 0, blockers, repair: blockers[0] ?? "healthy" };
}

const states = [
  { id: "healthy", silentTakeover: false, offlineShellVisible: true, oldCachesPurged: true, reloadPromptVisible: true, waitingUpdate: false },
  { id: "broken", silentTakeover: true, offlineShellVisible: false, oldCachesPurged: false, reloadPromptVisible: false, waitingUpdate: true }
];

console.log(states.map(detectOfflineShellRisk));
