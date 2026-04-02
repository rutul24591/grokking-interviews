function detectCallFailures(cases) {
  return cases.map((entry) => ({
    session: entry.session,
    showReconnectSheet: entry.transportDropped,
    switchToAudioOnly: entry.cameraLost && entry.micStillHealthy,
    endCallSafely: entry.signalingGone && entry.transportDropped
  }));
}

console.log(JSON.stringify(detectCallFailures([
  { session: "daily standup", transportDropped: false, cameraLost: false, micStillHealthy: true, signalingGone: false },
  { session: "support call", transportDropped: true, cameraLost: true, micStillHealthy: true, signalingGone: false },
  { session: "exec review", transportDropped: true, cameraLost: true, micStillHealthy: false, signalingGone: true }
]), null, 2));
