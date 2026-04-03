function detectPwaExperienceRisk(state) {
  const blockers = [];
  if (state.shellHealth !== "healthy" && state.promptShown) blockers.push("prompt-before-shell-ready");
  if (state.offline && state.cachedRoutes < 2) blockers.push("offline-shell-too-thin");
  if (state.queueStaleMinutes > 20) blockers.push("queued-actions-stale");
  if (state.pushPrompted && !state.installed) blockers.push("push-before-install");
  return {
    id: state.id,
    healthy: blockers.length === 0,
    blockers,
    mitigation: blockers.includes("queued-actions-stale") ? "surface-sync-repair" : blockers[0] ?? "healthy"
  };
}

const states = [
  { id: "healthy-pwa", shellHealth: "healthy", promptShown: true, offline: true, cachedRoutes: 3, queueStaleMinutes: 5, pushPrompted: false, installed: false },
  { id: "broken-offline", shellHealth: "degraded", promptShown: true, offline: true, cachedRoutes: 1, queueStaleMinutes: 32, pushPrompted: true, installed: false }
];

console.log(states.map(detectPwaExperienceRisk));
