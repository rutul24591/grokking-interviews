function falsePositiveRisk(cases) {
  const flagged = cases
    .filter((entry) => (entry.confidence > 85 && entry.uniqueSignals < 2) || entry.recentManualOverturns > 3)
    .map((entry) => ({
      id: entry.id,
      action: "route-human-review",
      reason: entry.recentManualOverturns > 3 ? "recent-overturn-trend" : "single-signal-overconfidence"
    }));

  return {
    flagged,
    disableAutomationForSegment: flagged.length >= 2
  };
}

console.log(
  falsePositiveRisk([
    { id: "segment-1", confidence: 92, uniqueSignals: 1, recentManualOverturns: 0 },
    { id: "segment-2", confidence: 76, uniqueSignals: 4, recentManualOverturns: 5 }
  ])
);
