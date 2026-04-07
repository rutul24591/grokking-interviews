function detectSharedWorkerDrift(state) {
  const blockers = [];
  if (!state.fallbackReady) blockers.push("unsupported-runtime-without-fallback");
  if (!state.queueBounded) blockers.push("shared-queue-unbounded");
  if (!state.idlePortsPruned) blockers.push("idle-ports-never-pruned");
  if (state.sharedStateStale) blockers.push("shared-state-stale-across-tabs");
  return { id: state.id, healthy: blockers.length === 0, blockers, repair: blockers[0] ?? "healthy" };
}

const states = [
  { id: "healthy", fallbackReady: true, queueBounded: true, idlePortsPruned: true, sharedStateStale: false },
  { id: "broken", fallbackReady: false, queueBounded: false, idlePortsPruned: false, sharedStateStale: true }
];

console.log(states.map(detectSharedWorkerDrift));
