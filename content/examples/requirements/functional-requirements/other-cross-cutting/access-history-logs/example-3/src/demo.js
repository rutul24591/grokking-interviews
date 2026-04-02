function evaluateAccessHistoryEdges(events) {
  return events.map((entry) => ({
    eventId: entry.eventId,
    redactOperatorIdentity: entry.privacyThresholdExceeded,
    mergeAnomalyCluster: entry.sameTicketSameOperator,
    replayLateEvent: entry.replicaLagDetected
  }));
}

console.log(JSON.stringify(evaluateAccessHistoryEdges([
  {
    "eventId": "edge-1",
    "privacyThresholdExceeded": true,
    "sameTicketSameOperator": false,
    "replicaLagDetected": false
  },
  {
    "eventId": "edge-2",
    "privacyThresholdExceeded": false,
    "sameTicketSameOperator": true,
    "replicaLagDetected": false
  },
  {
    "eventId": "edge-3",
    "privacyThresholdExceeded": false,
    "sameTicketSameOperator": false,
    "replicaLagDetected": true
  }
]), null, 2));
