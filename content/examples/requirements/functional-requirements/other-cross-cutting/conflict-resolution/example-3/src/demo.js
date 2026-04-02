function evaluateConflictEdges(writes) {
  return writes.map((entry) => ({
    requestId: entry.requestId,
    pinCanonicalVersion: entry.outOfOrderReplicaRead,
    dropReplayWrite: entry.retryProducedDuplicate,
    escalateSplitBrain: entry.twoPrimariesObserved
  }));
}

console.log(JSON.stringify(evaluateConflictEdges([
  {
    "requestId": "edge-1",
    "outOfOrderReplicaRead": true,
    "retryProducedDuplicate": false,
    "twoPrimariesObserved": false
  },
  {
    "requestId": "edge-2",
    "outOfOrderReplicaRead": false,
    "retryProducedDuplicate": true,
    "twoPrimariesObserved": false
  },
  {
    "requestId": "edge-3",
    "outOfOrderReplicaRead": false,
    "retryProducedDuplicate": false,
    "twoPrimariesObserved": true
  }
]), null, 2));
