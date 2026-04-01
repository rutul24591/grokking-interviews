function accessibilityFallback(config) {
  if (config.keyboardNavigationMissing || config.screenReaderSummaryMissing) {
    return {
      mode: "table-fallback",
      reason: "interaction-not-accessible",
      preserveSelectionSummary: true
    };
  }

  if (config.touchOnly && config.brushSelectionRequired) {
    return {
      mode: "simplified-segment-selection",
      reason: "brush-not-practical-on-touch",
      preserveSelectionSummary: true
    };
  }

  return { mode: "interactive-chart", reason: "accessible-controls-present", preserveSelectionSummary: false };
}

console.log(
  accessibilityFallback({
    keyboardNavigationMissing: false,
    screenReaderSummaryMissing: false,
    touchOnly: true,
    brushSelectionRequired: true
  })
);
