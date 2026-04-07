function detectBroadcastSplitBrain(state) {
  const blockers = [];
  if (state.multipleWritableTabs) blockers.push("multiple-writers-active");
  if (state.staleTabWritable) blockers.push("stale-tab-still-writable");
  if (state.replayMissingAfterHandoff) blockers.push("handoff-dropped-unsent-events");
  if (!state.heartbeatTelemetryVisible) blockers.push("coordination-diagnostics-hidden");
  return { id: state.id, healthy: blockers.length === 0, blockers, repair: blockers[0] ?? "healthy" };
}

const states = [
  { id: "healthy", multipleWritableTabs: false, staleTabWritable: false, replayMissingAfterHandoff: false, heartbeatTelemetryVisible: true },
  { id: "broken", multipleWritableTabs: true, staleTabWritable: true, replayMissingAfterHandoff: true, heartbeatTelemetryVisible: false }
];

console.log(states.map(detectBroadcastSplitBrain));
