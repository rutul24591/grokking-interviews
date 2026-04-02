function detectBlindSpots(monitors) {
  const stale = monitors.filter((monitor) => monitor.minutesSinceUpdate > monitor.maxStaleness).map((monitor) => monitor.metric);
  const missingCoverage = monitors.filter((monitor) => monitor.required && monitor.present === false).map((monitor) => monitor.metric);
  return {
    stale,
    missingCoverage,
    pageOps: stale.length > 0 || missingCoverage.length > 0
  };
}

console.log(
  detectBlindSpots([
    { metric: "Queue latency", minutesSinceUpdate: 3, maxStaleness: 5, required: true, present: true },
    { metric: "Takedown pipeline", minutesSinceUpdate: 18, maxStaleness: 10, required: true, present: true },
    { metric: "Legal SLA feed", minutesSinceUpdate: 0, maxStaleness: 5, required: true, present: false }
  ])
);
