function planMutationObserverScope(config) {
  const actions = [];
  if (config.scope === "document") actions.push("reduce-observer-scope");
  if (config.mutationRate > 15) actions.push("coalesce-and-throttle");
  if (!config.disconnectOnUnmount) actions.push("add-cleanup-hook");
  return {
    id: config.id,
    actions,
    safeScope: config.scope === "document" ? "feature-subtree" : config.scope,
    shipReady: !actions.includes("add-cleanup-hook")
  };
}

const configs = [
  { id: "editor", scope: "editor", mutationRate: 4, disconnectOnUnmount: true },
  { id: "widget", scope: "widget", mutationRate: 17, disconnectOnUnmount: true },
  { id: "global", scope: "document", mutationRate: 47, disconnectOnUnmount: false }
];

console.log(configs.map(planMutationObserverScope));
