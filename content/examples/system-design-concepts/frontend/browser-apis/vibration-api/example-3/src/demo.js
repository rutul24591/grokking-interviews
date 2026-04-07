function detectHapticFallbackRisk(state) {
  const blockers = [];
  if (!state.fallbackVisible) blockers.push("non-haptic-fallback-hidden");
  if (!state.reducedMotionRespected) blockers.push("reduced-motion-preference-ignored");
  if (!state.urgentOnly) blockers.push("haptics-spilled-into-non-urgent-flows");
  if (state.unsupportedDeviceStillAdvertised) blockers.push("unsupported-device-still-promises-haptics");
  return { id: state.id, healthy: blockers.length === 0, blockers, repair: blockers[0] ?? "healthy" };
}

const states = [
  { id: "healthy", fallbackVisible: true, reducedMotionRespected: true, urgentOnly: true, unsupportedDeviceStillAdvertised: false },
  { id: "broken", fallbackVisible: false, reducedMotionRespected: false, urgentOnly: false, unsupportedDeviceStillAdvertised: true }
];

console.log(states.map(detectHapticFallbackRisk));
