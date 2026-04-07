function planServiceWorkerUpdate(flow) {
  const actions = [];
  if (flow.updateWaiting) actions.push("show-reload-prompt");
  if (!flow.offlineShellReady) actions.push("repair-offline-shell");
  if (!flow.cacheVersioned) actions.push("add-cache-versioning");
  return {
    id: flow.id,
    actions,
    takeoverMode: flow.updateWaiting ? "staged" : "active",
    shipReady: !actions.includes("repair-offline-shell")
  };
}

const flows = [
  { id: "healthy", updateWaiting: false, offlineShellReady: true, cacheVersioned: true },
  { id: "waiting", updateWaiting: true, offlineShellReady: true, cacheVersioned: true },
  { id: "stale", updateWaiting: false, offlineShellReady: false, cacheVersioned: false }
];

console.log(flows.map(planServiceWorkerUpdate));
