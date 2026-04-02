function evaluateWebRtcReadiness(cases) {
  return cases.map((entry) => ({
    peer: entry.peer,
    canConnect: entry.signalingReady && entry.hasLocalDescription && entry.hasRemoteDescription,
    waitForMoreCandidates: entry.selectedCandidate === null && entry.candidateCount > 0,
    forceTurnFallback: entry.symmetricNat && !entry.turnAvailable
  }));
}

console.log(JSON.stringify(evaluateWebRtcReadiness([
  { peer: "session-a", signalingReady: true, hasLocalDescription: true, hasRemoteDescription: true, selectedCandidate: "host", candidateCount: 3, symmetricNat: false, turnAvailable: true },
  { peer: "session-b", signalingReady: true, hasLocalDescription: true, hasRemoteDescription: false, selectedCandidate: null, candidateCount: 2, symmetricNat: false, turnAvailable: true },
  { peer: "session-c", signalingReady: true, hasLocalDescription: true, hasRemoteDescription: true, selectedCandidate: null, candidateCount: 0, symmetricNat: true, turnAvailable: false }
]), null, 2));
