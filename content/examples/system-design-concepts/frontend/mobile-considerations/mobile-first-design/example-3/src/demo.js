function detectMobileFirstRegression(state) {
  const issues = [];
  if (state.width < 480 && state.secondaryRailVisible) issues.push("rail-leaked-into-phone-layout");
  if (!state.contentOrderStable) issues.push("content-order-changed");
  if (state.width < 480 && !state.primaryActionReachable) issues.push("primary-action-out-of-reach");
  return {
    id: state.id,
    healthy: issues.length === 0,
    issues,
    repair: issues[0] ?? "healthy"
  };
}

const states = [
  { id: "healthy", width: 390, secondaryRailVisible: false, contentOrderStable: true, primaryActionReachable: true },
  { id: "broken", width: 390, secondaryRailVisible: true, contentOrderStable: false, primaryActionReachable: false }
];

console.log(states.map(detectMobileFirstRegression));
