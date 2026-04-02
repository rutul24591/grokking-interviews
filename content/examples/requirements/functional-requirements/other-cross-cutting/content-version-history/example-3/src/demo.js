function evaluateVersionEdges(revisions) {
  return revisions.map((entry) => ({
    revisionId: entry.revisionId,
    blockRollback: entry.commentThreadWouldBreak,
    restoreMetadataSeparately: entry.metadataOnlyRegression,
    pinComparisonBaseline: entry.historyGapDetected
  }));
}

console.log(JSON.stringify(evaluateVersionEdges([
  {
    "revisionId": "edge-1",
    "commentThreadWouldBreak": true,
    "metadataOnlyRegression": false,
    "historyGapDetected": false
  },
  {
    "revisionId": "edge-2",
    "commentThreadWouldBreak": false,
    "metadataOnlyRegression": true,
    "historyGapDetected": false
  },
  {
    "revisionId": "edge-3",
    "commentThreadWouldBreak": false,
    "metadataOnlyRegression": false,
    "historyGapDetected": true
  }
]), null, 2));
