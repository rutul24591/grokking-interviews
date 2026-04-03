function detectDebounceRisk(state) {
  const blockers = [];
  if (state.cancellationMissing && !state.responseGuardEnabled) blockers.push("stale-response-can-render");
  if (state.pendingHidden && state.requestLagging) blockers.push("lag-hidden-from-user");
  if (state.outOfOrderResponses && !state.queryIdPinned) blockers.push("out-of-order-response-risk");
  if (state.inflightRequests > 2 && !state.rollupTelemetryVisible) blockers.push("burst-overload-hidden-from-qa");
  return {
    id: state.id,
    healthy: blockers.length === 0,
    blockers,
    repair: blockers[0] ?? "healthy",
    escalation: blockers.length > 1 ? "block-release" : "watch"
  };
}

const states = [
  { id: "healthy", cancellationMissing: false, responseGuardEnabled: true, pendingHidden: false, requestLagging: false, outOfOrderResponses: false, queryIdPinned: true, inflightRequests: 1, rollupTelemetryVisible: true },
  { id: "broken", cancellationMissing: true, responseGuardEnabled: false, pendingHidden: true, requestLagging: true, outOfOrderResponses: true, queryIdPinned: false, inflightRequests: 4, rollupTelemetryVisible: false }
];

console.log(states.map(detectDebounceRisk));
