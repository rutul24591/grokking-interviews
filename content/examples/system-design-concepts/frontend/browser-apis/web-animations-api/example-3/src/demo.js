function detectAnimationHandleLeak(state) {
  const blockers = [];
  if (state.orphanedHandles) blockers.push("animation-handles-leaking");
  if (state.offscreenStillRunning) blockers.push("offscreen-animations-still-running");
  if (!state.reducedMotionRespected) blockers.push("reduced-motion-fallback-missing");
  if (!state.budgetTelemetryVisible) blockers.push("animation-budget-hidden");
  return { id: state.id, healthy: blockers.length === 0, blockers, repair: blockers[0] ?? "healthy" };
}

const states = [
  { id: "healthy", orphanedHandles: false, offscreenStillRunning: false, reducedMotionRespected: true, budgetTelemetryVisible: true },
  { id: "broken", orphanedHandles: true, offscreenStillRunning: true, reducedMotionRespected: false, budgetTelemetryVisible: false }
];

console.log(states.map(detectAnimationHandleLeak));
