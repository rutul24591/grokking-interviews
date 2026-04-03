function detectMobileNetworkRisk(state) {
  const risks = [];
  if (state.saveData && state.autoplayEnabled) risks.push("autoplay-ignores-save-data");
  if (state.prefetchCount > 2 && state.latencyMs > 250) risks.push("prefetch-over-budget");
  if (state.pendingRequests > 5 && state.pollingMode === "steady") risks.push("polling-saturation");
  return {
    id: state.id,
    healthy: risks.length === 0,
    risks,
    mitigation: risks[0] ?? "healthy"
  };
}

const states = [
  { id: "healthy", saveData: false, autoplayEnabled: false, prefetchCount: 1, latencyMs: 90, pendingRequests: 2, pollingMode: "steady" },
  { id: "broken", saveData: true, autoplayEnabled: true, prefetchCount: 4, latencyMs: 320, pendingRequests: 6, pollingMode: "steady" }
];

console.log(states.map(detectMobileNetworkRisk));
