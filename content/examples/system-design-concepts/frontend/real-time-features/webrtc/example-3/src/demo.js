function detectWebRtcFailure(state) {
  const issues = [];
  if (state.iceState === "failed" && !state.audioFallbackVisible) issues.push("missing-audio-fallback");
  if (state.renegotiationPending && state.deviceChangesAllowed) issues.push("device-change-during-renegotiation");
  if (state.remoteDeviceUnknown && !state.reconnectBannerVisible) issues.push("peer-loss-hidden");
  if (state.signalingState !== "stable" && !state.signalingStateVisible) issues.push("signaling-state-hidden");
  return {
    id: state.id,
    healthy: issues.length === 0,
    issues,
    repair: issues.includes("signaling-state-hidden") ? "surface-signaling-state" : issues[0] ?? "healthy"
  };
}

const states = [
  { id: "healthy", iceState: "connected", audioFallbackVisible: true, renegotiationPending: false, deviceChangesAllowed: false, remoteDeviceUnknown: false, reconnectBannerVisible: true, signalingState: "stable", signalingStateVisible: true },
  { id: "broken", iceState: "failed", audioFallbackVisible: false, renegotiationPending: true, deviceChangesAllowed: true, remoteDeviceUnknown: true, reconnectBannerVisible: false, signalingState: "have-local-offer", signalingStateVisible: false }
];

const audits = states.map(detectWebRtcFailure);
console.log(audits);
console.log({ recoveries: audits.map((item) => item.repair) });
