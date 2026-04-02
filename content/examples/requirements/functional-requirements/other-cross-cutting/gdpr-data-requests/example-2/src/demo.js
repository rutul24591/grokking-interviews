function evaluateGdprRequests(requests) {
  return requests.map((entry) => ({
    requestId: entry.requestId,
    canStartClock: entry.identityVerified && entry.rightRecognized,
    needsProcessorSweep: entry.thirdPartyProcessors > 0 && !entry.allProcessorsAcked,
    allowDeadlineExtension: entry.requestComplexityHigh && !entry.extensionUsed
  }));
}

console.log(JSON.stringify(evaluateGdprRequests([
  {
    "requestId": "gdpr-1",
    "identityVerified": true,
    "rightRecognized": true,
    "thirdPartyProcessors": 2,
    "allProcessorsAcked": false,
    "requestComplexityHigh": true,
    "extensionUsed": false
  },
  {
    "requestId": "gdpr-2",
    "identityVerified": true,
    "rightRecognized": true,
    "thirdPartyProcessors": 0,
    "allProcessorsAcked": true,
    "requestComplexityHigh": false,
    "extensionUsed": false
  },
  {
    "requestId": "gdpr-3",
    "identityVerified": false,
    "rightRecognized": false,
    "thirdPartyProcessors": 3,
    "allProcessorsAcked": false,
    "requestComplexityHigh": true,
    "extensionUsed": true
  }
]), null, 2));
