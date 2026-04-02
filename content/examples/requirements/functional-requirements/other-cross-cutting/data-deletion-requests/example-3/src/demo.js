function evaluateDeletionEdges(requests) {
  return requests.map((entry) => ({
    requestId: entry.requestId,
    pauseFulfillment: entry.restorationBackupStillLive,
    reissueNotice: entry.partnerProcessorLateAck,
    rejectReplay: entry.duplicateRequestWindowOpen
  }));
}

console.log(JSON.stringify(evaluateDeletionEdges([
  {
    "requestId": "edge-a",
    "restorationBackupStillLive": true,
    "partnerProcessorLateAck": false,
    "duplicateRequestWindowOpen": false
  },
  {
    "requestId": "edge-b",
    "restorationBackupStillLive": false,
    "partnerProcessorLateAck": true,
    "duplicateRequestWindowOpen": false
  },
  {
    "requestId": "edge-c",
    "restorationBackupStillLive": false,
    "partnerProcessorLateAck": false,
    "duplicateRequestWindowOpen": true
  }
]), null, 2));
