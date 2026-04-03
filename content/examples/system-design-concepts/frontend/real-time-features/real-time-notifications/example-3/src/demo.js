function detectNotificationFailure(state) {
  const issues = [];
  if (state.muted && state.pushSent) issues.push("muted-thread-push-leak");
  if (state.deliveryState !== "healthy" && !state.fallbackInboxVisible) issues.push("degraded-channel-without-inbox-fallback");
  if (state.duplicateAcrossChannels) issues.push("cross-channel-duplicate-notification");
  if (state.digestMode && state.urgentCount > 0) issues.push("urgent-item-buried-in-digest");
  return {
    id: state.id,
    healthy: issues.length === 0,
    issues,
    repair: issues.includes("urgent-item-buried-in-digest") ? "break-urgent-item-out-of-digest" : issues[0] ?? "healthy"
  };
}

const states = [
  { id: "healthy", muted: false, pushSent: true, deliveryState: "healthy", fallbackInboxVisible: true, duplicateAcrossChannels: false, digestMode: false, urgentCount: 2 },
  { id: "broken", muted: true, pushSent: true, deliveryState: "repair", fallbackInboxVisible: false, duplicateAcrossChannels: true, digestMode: true, urgentCount: 1 }
];

const audits = states.map(detectNotificationFailure);
console.log(audits);
console.log({ repairs: audits.map((item) => ({ id: item.id, repair: item.repair })) });
