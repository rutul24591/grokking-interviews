function evaluateCallReadiness(cases) {
  return cases.map((entry) => ({
    session: entry.session,
    canJoin: entry.cameraReady && entry.micReady && entry.networkOk,
    shouldOfferVoiceOnly: entry.micReady && !entry.cameraReady,
    blockUntilPermissionsResolved: !entry.permissionsGranted
  }));
}

console.log(JSON.stringify(evaluateCallReadiness([
  { session: "daily standup", cameraReady: true, micReady: true, networkOk: true, permissionsGranted: true },
  { session: "support call", cameraReady: false, micReady: true, networkOk: true, permissionsGranted: true },
  { session: "exec review", cameraReady: true, micReady: false, networkOk: false, permissionsGranted: false }
]), null, 2));
