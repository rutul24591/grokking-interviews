function detectViewportBreakage(state) {
  const issues = [];
  if (state.zoomDisabled && (state.formHeavy || state.denseContent)) issues.push("zoom-disabled-on-accessibility-sensitive-page");
  if (state.notchedDevice && !state.safeAreaAware) issues.push("safe-area-cutoff");
  if (state.keyboardOpen && state.fixedHeader && !state.visualViewportAware) issues.push("keyboard-overlap-risk");
  return {
    id: state.id,
    healthy: issues.length === 0,
    issues,
    repair: issues[0] ?? "healthy"
  };
}

const states = [
  { id: "healthy", zoomDisabled: false, formHeavy: true, denseContent: true, notchedDevice: true, safeAreaAware: true, keyboardOpen: true, fixedHeader: true, visualViewportAware: true },
  { id: "broken", zoomDisabled: true, formHeavy: true, denseContent: true, notchedDevice: true, safeAreaAware: false, keyboardOpen: true, fixedHeader: true, visualViewportAware: false }
];

console.log(states.map(detectViewportBreakage));
