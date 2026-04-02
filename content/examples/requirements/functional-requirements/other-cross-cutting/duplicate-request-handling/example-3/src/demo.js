function evaluateDuplicateEdges(requests) {
  return requests.map((entry) => ({
    requestId: entry.requestId,
    expireReplayWindow: entry.keyTooOld,
    suppressSecondaryWebhook: entry.webhookAlreadySent,
    rebuildOutcomeLedger: entry.outcomeStoreCorrupt
  }));
}

console.log(JSON.stringify(evaluateDuplicateEdges([
  {
    "requestId": "edge-1",
    "keyTooOld": true,
    "webhookAlreadySent": false,
    "outcomeStoreCorrupt": false
  },
  {
    "requestId": "edge-2",
    "keyTooOld": false,
    "webhookAlreadySent": true,
    "outcomeStoreCorrupt": false
  },
  {
    "requestId": "edge-3",
    "keyTooOld": false,
    "webhookAlreadySent": false,
    "outcomeStoreCorrupt": true
  }
]), null, 2));
