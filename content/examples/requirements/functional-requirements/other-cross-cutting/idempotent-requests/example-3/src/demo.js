function evaluateIdempotentEdges(requests) {
  return requests.map((entry) => ({
    requestId: entry.requestId,
    dropCrossTenantReplay: entry.tenantBoundaryMismatch,
    rotateStuckOutcome: entry.outcomePendingTooLong,
    invalidateOldKey: entry.keyWindowExpired
  }));
}

console.log(JSON.stringify(evaluateIdempotentEdges([
  {
    "requestId": "edge-1",
    "tenantBoundaryMismatch": true,
    "outcomePendingTooLong": false,
    "keyWindowExpired": false
  },
  {
    "requestId": "edge-2",
    "tenantBoundaryMismatch": false,
    "outcomePendingTooLong": true,
    "keyWindowExpired": false
  },
  {
    "requestId": "edge-3",
    "tenantBoundaryMismatch": false,
    "outcomePendingTooLong": false,
    "keyWindowExpired": true
  }
]), null, 2));
