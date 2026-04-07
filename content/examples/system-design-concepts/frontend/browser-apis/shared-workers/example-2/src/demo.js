function planSharedWorkerCoordination(config) {
  const actions = [];
  if (!config.supported) actions.push("dedicated-worker-fallback");
  if (config.queueDepth > 12) actions.push("prune-idle-ports-and-dedupe");
  if (!config.authorityDocumented) actions.push("document-shared-worker-boundary");
  return {
    id: config.id,
    actions,
    activeMode: config.supported ? "shared-worker" : "fallback",
    shipReady: !actions.includes("document-shared-worker-boundary")
  };
}

const configs = [
  { id: "healthy", supported: true, queueDepth: 6, authorityDocumented: true },
  { id: "churn", supported: true, queueDepth: 18, authorityDocumented: true },
  { id: "fallback", supported: false, queueDepth: 0, authorityDocumented: false }
];

console.log(configs.map(planSharedWorkerCoordination));
