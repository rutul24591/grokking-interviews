function evaluateZeroDowntimePlan(plan) {
  const actions = [];

  if (!plan.readinessRepresentsCustomerPath) actions.push("fix-readiness-definition");
  if (plan.connectionDrainSeconds < plan.longestSessionSeconds) actions.push("extend-drain-window");
  if (!plan.oldHtmlCompatibleWithNewAssets) actions.push("pin-asset-versioning");
  if (plan.schemaCompatibilityBroken) actions.push("block-traffic-shift");

  return { id: plan.id, safe: actions.length === 0, actions };
}

const plans = [
  { id: "healthy", readinessRepresentsCustomerPath: true, connectionDrainSeconds: 90, longestSessionSeconds: 45, oldHtmlCompatibleWithNewAssets: true, schemaCompatibilityBroken: false },
  { id: "feed", readinessRepresentsCustomerPath: false, connectionDrainSeconds: 15, longestSessionSeconds: 120, oldHtmlCompatibleWithNewAssets: true, schemaCompatibilityBroken: false },
  { id: "checkout", readinessRepresentsCustomerPath: true, connectionDrainSeconds: 60, longestSessionSeconds: 30, oldHtmlCompatibleWithNewAssets: false, schemaCompatibilityBroken: true }
];

console.log(plans.map(evaluateZeroDowntimePlan));
