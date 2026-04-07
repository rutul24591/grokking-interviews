function detectVisualRegressionRisk(state) {
  const blockers = [];

  if (state.diffIgnoredAsNoise && state.layoutShiftDetected) blockers.push("structural-regression-dismissed-as-noise");
  if (state.dynamicContentUnmasked) blockers.push("flaky-diff-from-uncontrolled-dynamic-region");
  if (state.baselineApprovedWithoutDesignSignoff) blockers.push("baseline-drift-became-accidental-product-change");
  if (state.missingViewportInSuite) blockers.push("responsive-regression-can-ship-undetected");
  if (state.fontOrThemeChanged && !state.variantBaselinesUpdated) blockers.push("theme-or-font-shift-lacks-fresh-baselines");

  return { id: state.id, healthy: blockers.length === 0, blockers, remediation: blockers.length ? "refresh-variants-and-reopen-visual-triage" : "healthy" };
}

const states = [
  { id: "healthy", diffIgnoredAsNoise: false, layoutShiftDetected: false, dynamicContentUnmasked: false, baselineApprovedWithoutDesignSignoff: false, missingViewportInSuite: false, fontOrThemeChanged: true, variantBaselinesUpdated: true },
  { id: "unsafe", diffIgnoredAsNoise: true, layoutShiftDetected: true, dynamicContentUnmasked: true, baselineApprovedWithoutDesignSignoff: true, missingViewportInSuite: true, fontOrThemeChanged: true, variantBaselinesUpdated: false }
];

console.log(states.map(detectVisualRegressionRisk));
