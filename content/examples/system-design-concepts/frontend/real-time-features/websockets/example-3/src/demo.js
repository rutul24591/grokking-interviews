function detectSocketFailure(state) {
  const issues = [];
  if (state.connectionState !== "open" && state.queueDropped) issues.push("outbound-actions-lost");
  if (state.reconnected && !state.subscriptionsRestored) issues.push("subscriptions-missing-after-reconnect");
  if (state.heartbeatLagMs > 1000 && !state.degradedBannerVisible) issues.push("lag-hidden-from-user");
  if (state.connectionState === "closed" && !state.manualReconnectVisible) issues.push("closed-socket-without-reconnect-action");
  return {
    id: state.id,
    healthy: issues.length === 0,
    issues,
    repair: issues.includes("closed-socket-without-reconnect-action") ? "show-manual-reconnect" : issues[0] ?? "healthy"
  };
}

const states = [
  { id: "healthy", connectionState: "open", queueDropped: false, reconnected: false, subscriptionsRestored: true, heartbeatLagMs: 120, degradedBannerVisible: true, manualReconnectVisible: true },
  { id: "broken", connectionState: "closed", queueDropped: true, reconnected: true, subscriptionsRestored: false, heartbeatLagMs: 1800, degradedBannerVisible: false, manualReconnectVisible: false }
];

const audits = states.map(detectSocketFailure);
console.log(audits);
console.log({ blockingIssues: audits.flatMap((item) => item.issues) });
