function evaluateGdprEdges(requests) {
  return requests.map((entry) => ({
    requestId: entry.requestId,
    pauseDeadline: entry.identityChallengeReopened,
    markPartialFulfillment: entry.processorMissedDeadline,
    escalateSupervisoryRisk: entry.extensionExpired && !entry.fulfilled
  }));
}

console.log(JSON.stringify(evaluateGdprEdges([
  {
    "requestId": "edge-1",
    "identityChallengeReopened": true,
    "processorMissedDeadline": false,
    "extensionExpired": false,
    "fulfilled": false
  },
  {
    "requestId": "edge-2",
    "identityChallengeReopened": false,
    "processorMissedDeadline": true,
    "extensionExpired": false,
    "fulfilled": false
  },
  {
    "requestId": "edge-3",
    "identityChallengeReopened": false,
    "processorMissedDeadline": false,
    "extensionExpired": true,
    "fulfilled": false
  }
]), null, 2));
