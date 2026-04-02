function evaluateRetryEdges(attempts) {
  return attempts.map((entry) => ({
    attemptId: entry.attemptId,
    tripCircuit: entry.errorRateSpike,
    jitterBackoff: entry.reconnectHerdRisk,
    suppressDuplicateRetry: entry.manualReplayAlreadyQueued
  }));
}

console.log(JSON.stringify(evaluateRetryEdges([
  {
    "attemptId": "edge-1",
    "errorRateSpike": true,
    "reconnectHerdRisk": false,
    "manualReplayAlreadyQueued": false
  },
  {
    "attemptId": "edge-2",
    "errorRateSpike": false,
    "reconnectHerdRisk": true,
    "manualReplayAlreadyQueued": false
  },
  {
    "attemptId": "edge-3",
    "errorRateSpike": false,
    "reconnectHerdRisk": false,
    "manualReplayAlreadyQueued": true
  }
]), null, 2));
