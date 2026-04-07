function detectWorkerProtocolRisk(state) {
  const blockers = [];
  if (state.protocolDrift) blockers.push("worker-protocol-drift");
  if (!state.staleResultRejected) blockers.push("stale-worker-result-can-paint-ui");
  if (!state.fallbackVisible) blockers.push("worker-fallback-hidden");
  if (state.mainThreadBlocked) blockers.push("fallback-path-still-blocks-main-thread");
  return { id: state.id, healthy: blockers.length === 0, blockers, repair: blockers[0] ?? "healthy" };
}

const states = [
  { id: "healthy", protocolDrift: false, staleResultRejected: true, fallbackVisible: true, mainThreadBlocked: false },
  { id: "broken", protocolDrift: true, staleResultRejected: false, fallbackVisible: false, mainThreadBlocked: true }
];

console.log(states.map(detectWorkerProtocolRisk));
