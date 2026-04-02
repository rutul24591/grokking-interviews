function evaluateDownloadEdges(requests) {
  return requests.map((entry) => ({
    requestId: entry.requestId,
    invalidateLink: entry.archiveRebuiltAfterDelivery,
    markPartialExport: entry.downstreamSystemUnavailable,
    revokeStaleArchive: entry.retentionWindowElapsed
  }));
}

console.log(JSON.stringify(evaluateDownloadEdges([
  {
    "requestId": "edge-1",
    "archiveRebuiltAfterDelivery": true,
    "downstreamSystemUnavailable": false,
    "retentionWindowElapsed": false
  },
  {
    "requestId": "edge-2",
    "archiveRebuiltAfterDelivery": false,
    "downstreamSystemUnavailable": true,
    "retentionWindowElapsed": false
  },
  {
    "requestId": "edge-3",
    "archiveRebuiltAfterDelivery": false,
    "downstreamSystemUnavailable": false,
    "retentionWindowElapsed": true
  }
]), null, 2));
