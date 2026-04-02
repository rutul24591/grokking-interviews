function evaluateTermsEdges(events) {
  return events.map((entry) => ({
    eventId: entry.eventId,
    invalidatePriorAcceptance: entry.policyHashChangedAfterAccept,
    replayPromptToAllDevices: entry.deviceSetDiverged,
    escalateAuditGap: entry.acceptanceEventLost
  }));
}

console.log(JSON.stringify(evaluateTermsEdges([
  {
    "eventId": "edge-1",
    "policyHashChangedAfterAccept": true,
    "deviceSetDiverged": false,
    "acceptanceEventLost": false
  },
  {
    "eventId": "edge-2",
    "policyHashChangedAfterAccept": false,
    "deviceSetDiverged": true,
    "acceptanceEventLost": false
  },
  {
    "eventId": "edge-3",
    "policyHashChangedAfterAccept": false,
    "deviceSetDiverged": false,
    "acceptanceEventLost": true
  }
]), null, 2));
