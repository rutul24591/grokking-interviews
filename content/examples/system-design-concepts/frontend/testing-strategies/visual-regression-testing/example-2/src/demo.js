function evaluateVisualCoverage(surface) {
  const actions = [];

  if (!surface.mobileBaselinePresent) actions.push("capture-mobile-baseline");
  if (!surface.loadingStateCovered || !surface.errorStateCovered) actions.push("cover-non-default-ui-states");
  if (!surface.themeVariantsCovered) actions.push("add-light-and-dark-variants");
  if (surface.baselineAgeDays > 60) actions.push("review-baseline-intent-before-approving");
  if (!surface.longTextAndOverflowCovered) actions.push("cover-localization-and-overflow-states");

  const lane = actions.length === 0 ? "ready" : actions.length <= 2 ? "watch" : "block";
  return { id: surface.id, lane, actions, ready: actions.length === 0 };
}

const surfaces = [
  { id: "hero", mobileBaselinePresent: true, loadingStateCovered: true, errorStateCovered: true, themeVariantsCovered: true, baselineAgeDays: 12, longTextAndOverflowCovered: true },
  { id: "search-cards", mobileBaselinePresent: false, loadingStateCovered: true, errorStateCovered: false, themeVariantsCovered: true, baselineAgeDays: 45, longTextAndOverflowCovered: false },
  { id: "checkout", mobileBaselinePresent: true, loadingStateCovered: false, errorStateCovered: false, themeVariantsCovered: false, baselineAgeDays: 91, longTextAndOverflowCovered: false }
];

console.log(surfaces.map(evaluateVisualCoverage));
