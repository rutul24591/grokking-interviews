function detectPerformanceRegression(state) {
  const blockers = [];
  if (state.cpuBudget === "critical" && state.heavyChartsLoaded) blockers.push("heavy-module-on-critical-device");
  if (state.longTaskMs > 150 && !state.reducedMotionApplied) blockers.push("reduced-motion-missing");
  if (state.memoryMb < 512 && state.backgroundWidgets > 2) blockers.push("memory-pressure-risk");
  return {
    id: state.id,
    healthy: blockers.length === 0,
    blockers,
    repair: blockers[0] ?? "healthy"
  };
}

const states = [
  { id: "healthy", cpuBudget: "tight", heavyChartsLoaded: false, longTaskMs: 120, reducedMotionApplied: true, memoryMb: 512, backgroundWidgets: 1 },
  { id: "broken", cpuBudget: "critical", heavyChartsLoaded: true, longTaskMs: 220, reducedMotionApplied: false, memoryMb: 256, backgroundWidgets: 3 }
];

console.log(states.map(detectPerformanceRegression));
