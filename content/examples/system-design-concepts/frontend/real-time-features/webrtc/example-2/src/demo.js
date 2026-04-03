function choosePeerRecovery(session) {
  return {
    id: session.id,
    downgradeToAudio: session.iceState !== "connected" || session.mediaState === "audio-only",
    freezeDeviceChanges: session.renegotiationPending,
    reconnectMode: session.iceState === "failed" ? "full-ice-restart" : session.iceState === "checking" ? "wait-and-monitor" : "healthy",
    deviceBanner: session.remoteDevice === "unknown" ? "show-peer-device-loss" : "normal"
  };
}

const sessions = [
  { id: "healthy", iceState: "connected", mediaState: "flowing", renegotiationPending: false, remoteDevice: "camera+mic" },
  { id: "lagging", iceState: "checking", mediaState: "audio-only", renegotiationPending: true, remoteDevice: "mic-only" },
  { id: "failed", iceState: "failed", mediaState: "muted", renegotiationPending: true, remoteDevice: "unknown" }
];

const plans = sessions.map(choosePeerRecovery);
console.log(plans);
console.log({ audioFallbackCount: plans.filter((plan) => plan.downgradeToAudio).length });
