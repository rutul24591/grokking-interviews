function detectInputRegression(state) {
  const failures = [];
  if (state.duplicateClickRisk) failures.push("duplicate-click-synthesis");
  if (!state.passiveHandlers && state.scrollContainer) failures.push("scroll-blocked-by-handler");
  if (!state.hoverSupport && state.hoverRequired) failures.push("hover-only-affordance-on-touch");
  return {
    id: state.id,
    healthy: failures.length === 0,
    failures,
    repair: failures[0] ?? "healthy"
  };
}

const states = [
  { id: "healthy", duplicateClickRisk: false, passiveHandlers: true, scrollContainer: true, hoverSupport: false, hoverRequired: false },
  { id: "broken", duplicateClickRisk: true, passiveHandlers: false, scrollContainer: true, hoverSupport: false, hoverRequired: true }
];

console.log(states.map(detectInputRegression));
