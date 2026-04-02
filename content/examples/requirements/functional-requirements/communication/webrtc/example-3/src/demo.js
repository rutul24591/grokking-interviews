function detectWebRtcFailures(cases) {
  return cases.map((entry) => ({
    peer: entry.peer,
    restartIce: entry.selectedPairFailed,
    preserveCallUi: entry.renegotiationFailed && entry.mediaStillFlowing,
    showReconnectAction: entry.renegotiationFailed && !entry.mediaStillFlowing
  }));
}

console.log(JSON.stringify(detectWebRtcFailures([
  { peer: "session-a", selectedPairFailed: false, renegotiationFailed: false, mediaStillFlowing: true },
  { peer: "session-b", selectedPairFailed: true, renegotiationFailed: true, mediaStillFlowing: true },
  { peer: "session-c", selectedPairFailed: true, renegotiationFailed: true, mediaStillFlowing: false }
]), null, 2));
