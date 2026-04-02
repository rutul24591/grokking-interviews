function buildAbuseDecision(cases, threshold) {
  return cases.map((entry) => {
    const score = entry.signals.reduce((total, signal) => total + signal.weight, 0);
    const criticalSignals = entry.signals.filter((signal) => signal.critical).map((signal) => signal.name);
    const route = score >= threshold || criticalSignals.length > 0 ? "escalate" : score >= threshold - 15 ? "review" : "monitor";

    return {
      id: entry.id,
      score,
      criticalSignals,
      route,
      reason:
        route === "escalate"
          ? "threshold-or-critical-signal"
          : route === "review"
            ? "near-threshold"
            : "background-observation"
    };
  });
}

console.log(
  buildAbuseDecision(
    [
      {
        id: "case-1",
        signals: [
          { name: "report-spike", weight: 40, critical: false },
          { name: "bot-pattern", weight: 38, critical: true }
        ]
      },
      {
        id: "case-2",
        signals: [
          { name: "fresh-account", weight: 18, critical: false },
          { name: "rapid-follow", weight: 22, critical: false }
        ]
      }
    ],
    72
  )
);
