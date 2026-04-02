function evaluateContentFlaggingEdges(assets) {
  return assets.map((entry) => ({
    assetId: entry.assetId,
    replayLastDecision: entry.reprocessedWithoutPolicyChange,
    dropDuplicateFlags: entry.sameReporterBurst && !entry.newEvidence,
    restoreVisibility: entry.appealWon && !entry.cachedSuppressionLeak
  }));
}

console.log(JSON.stringify(evaluateContentFlaggingEdges([
  {
    "assetId": "edge-1",
    "reprocessedWithoutPolicyChange": true,
    "sameReporterBurst": false,
    "newEvidence": false,
    "appealWon": false,
    "cachedSuppressionLeak": false
  },
  {
    "assetId": "edge-2",
    "reprocessedWithoutPolicyChange": false,
    "sameReporterBurst": true,
    "newEvidence": false,
    "appealWon": false,
    "cachedSuppressionLeak": false
  },
  {
    "assetId": "edge-3",
    "reprocessedWithoutPolicyChange": false,
    "sameReporterBurst": false,
    "newEvidence": true,
    "appealWon": true,
    "cachedSuppressionLeak": false
  }
]), null, 2));
