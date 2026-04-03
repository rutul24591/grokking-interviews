function planMobileTransport(profile) {
  const prefetchBudget = profile.saveData ? 0 : profile.latencyMs > 250 ? 1 : 2;
  const payloadMode = profile.saveData || profile.downlinkMbps < 1 ? "summary-only" : profile.pendingRequests > 4 ? "batched-rich" : "rich";
  return {
    id: profile.id,
    prefetchBudget,
    payloadMode,
    pollingMode: profile.latencyMs > 250 ? "backoff" : "steady"
  };
}

const profiles = [
  { id: "fast", saveData: false, latencyMs: 90, downlinkMbps: 10, pendingRequests: 2 },
  { id: "slow", saveData: false, latencyMs: 320, downlinkMbps: 1.5, pendingRequests: 5 },
  { id: "save-data", saveData: true, latencyMs: 500, downlinkMbps: 0.4, pendingRequests: 6 }
];

console.log(profiles.map(planMobileTransport));
