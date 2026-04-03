function detectResponsiveRegression(state) {
  const issues = [];
  if (state.width < 500 && state.navigationMode !== "bottom-nav") issues.push("missing-bottom-nav");
  if (!state.readingOrderStable) issues.push("reading-order-broken");
  if (!state.tapTargetSafe && state.touchCapable) issues.push("tap-targets-too-small");
  return {
    id: state.id,
    healthy: issues.length === 0,
    issues,
    repair: issues[0] ?? "healthy"
  };
}

const states = [
  { id: "healthy", width: 390, navigationMode: "bottom-nav", readingOrderStable: true, tapTargetSafe: true, touchCapable: true },
  { id: "broken", width: 820, navigationMode: "rail", readingOrderStable: false, tapTargetSafe: false, touchCapable: true }
];

console.log(states.map(detectResponsiveRegression));
