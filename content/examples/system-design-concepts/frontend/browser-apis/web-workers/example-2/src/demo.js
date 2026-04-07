function planWorkerOffload(flow) {
  const actions = [];
  if (flow.payloadMb > 20) actions.push("keep-off-thread");
  if (!flow.protocolVersioned) actions.push("version-worker-messages");
  if (!flow.staleGuardEnabled) actions.push("drop-obsolete-results");
  return {
    id: flow.id,
    actions,
    executionLane: flow.payloadMb > 20 ? "worker" : "either",
    shipReady: !actions.includes("version-worker-messages") && !actions.includes("drop-obsolete-results")
  };
}

const flows = [
  { id: "index", payloadMb: 28, protocolVersioned: true, staleGuardEnabled: true },
  { id: "preview", payloadMb: 6, protocolVersioned: true, staleGuardEnabled: false },
  { id: "drift", payloadMb: 14, protocolVersioned: false, staleGuardEnabled: false }
];

console.log(flows.map(planWorkerOffload));
