function detectLocationFallbackRisk(state) {
  const blockers = [];
  if (state.permissionDenied && !state.manualAddressVisible) blockers.push("denied-without-manual-address");
  if (state.staleCoordinatesUsedForRouting) blockers.push("stale-position-still-driving-actions");
  if (state.highAccuracyWhileHidden) blockers.push("precision-mode-running-offscreen");
  if (!state.reasonVisible) blockers.push("location-value-not-explained-to-user");
  return { id: state.id, healthy: blockers.length === 0, blockers, repair: blockers[0] ?? "healthy" };
}

const states = [
  { id: "healthy", permissionDenied: false, manualAddressVisible: true, staleCoordinatesUsedForRouting: false, highAccuracyWhileHidden: false, reasonVisible: true },
  { id: "broken", permissionDenied: true, manualAddressVisible: false, staleCoordinatesUsedForRouting: true, highAccuracyWhileHidden: true, reasonVisible: false }
];

console.log(states.map(detectLocationFallbackRisk));
