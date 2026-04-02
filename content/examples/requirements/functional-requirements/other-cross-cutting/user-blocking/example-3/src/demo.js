function evaluateUserBlockingEdges(cases) {
  return cases.map((entry) => ({
    caseId: entry.caseId,
    retainOneWayBlock: entry.mutualBlockMismatch,
    replaySuppressionJobs: entry.cacheBackfillMissed,
    delayUnblock: entry.legalRestrictionHold
  }));
}

console.log(JSON.stringify(evaluateUserBlockingEdges([
  {
    "caseId": "edge-1",
    "mutualBlockMismatch": true,
    "cacheBackfillMissed": false,
    "legalRestrictionHold": false
  },
  {
    "caseId": "edge-2",
    "mutualBlockMismatch": false,
    "cacheBackfillMissed": true,
    "legalRestrictionHold": false
  },
  {
    "caseId": "edge-3",
    "mutualBlockMismatch": false,
    "cacheBackfillMissed": false,
    "legalRestrictionHold": true
  }
]), null, 2));
