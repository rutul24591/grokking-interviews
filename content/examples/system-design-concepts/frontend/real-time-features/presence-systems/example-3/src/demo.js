function detectPresenceFailure(state) {
  const issues = [];
  if (state.staleUsers > 0 && !state.staleIndicatorVisible) issues.push("ghost-users-visible-as-active");
  if (state.heartbeatSeconds > 30 && !state.degradedBannerVisible) issues.push("presence-degradation-hidden");
  if (state.transientDisconnects > 2 && !state.debounceEnabled) issues.push("presence-flicker-risk");
  if (state.handoffTriggered && !state.handoffGuardVisible) issues.push("handoff-allowed-during-unstable-presence");
  return {
    id: state.id,
    healthy: issues.length === 0,
    issues,
    repair: issues.includes("handoff-allowed-during-unstable-presence") ? "block-handoff-until-stable" : issues[0] ?? "healthy"
  };
}

const states = [
  { id: "healthy", staleUsers: 1, staleIndicatorVisible: true, heartbeatSeconds: 15, degradedBannerVisible: true, transientDisconnects: 1, debounceEnabled: true, handoffTriggered: false, handoffGuardVisible: true },
  { id: "broken", staleUsers: 4, staleIndicatorVisible: false, heartbeatSeconds: 40, degradedBannerVisible: false, transientDisconnects: 5, debounceEnabled: false, handoffTriggered: true, handoffGuardVisible: false }
];

const audits = states.map(detectPresenceFailure);
console.log(audits);
console.log({ hiddenFailures: audits.filter((item) => !item.healthy).length });
