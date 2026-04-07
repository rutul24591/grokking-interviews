function evaluateBundlerPlan(plan) {
  const actions = [];

  if (!plan.pluginMatrixCurrent) actions.push("refresh-plugin-compatibility-matrix");
  if (plan.bundleDeltaPct > 10) actions.push("investigate-output-budget-regression");
  if (plan.migrationTouchesLegacyLoader) actions.push("assign-loader-migration-owner");
  if (!plan.previewParity) actions.push("close-preview-production-config-gap");

  return { id: plan.id, acceptable: actions.length === 0, actions };
}

const plans = [
  { id: "vite", pluginMatrixCurrent: true, bundleDeltaPct: 3, migrationTouchesLegacyLoader: false, previewParity: true },
  { id: "webpack-upgrade", pluginMatrixCurrent: false, bundleDeltaPct: 6, migrationTouchesLegacyLoader: true, previewParity: true },
  { id: "rollup-output", pluginMatrixCurrent: true, bundleDeltaPct: 18, migrationTouchesLegacyLoader: false, previewParity: false }
];

console.log(plans.map(evaluateBundlerPlan));
