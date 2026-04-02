function evaluateRecoveryEdges(candidates) {
  return candidates.map((entry) => ({
    assetId: entry.assetId,
    freezeAutoRestore: entry.restoredVersionOlderThanDraft,
    repairReferenceMap: entry.brokenAssetPointers,
    requireAuthorSignoff: entry.restoredModerationFlagsMismatch
  }));
}

console.log(JSON.stringify(evaluateRecoveryEdges([
  {
    "assetId": "edge-1",
    "restoredVersionOlderThanDraft": true,
    "brokenAssetPointers": false,
    "restoredModerationFlagsMismatch": false
  },
  {
    "assetId": "edge-2",
    "restoredVersionOlderThanDraft": false,
    "brokenAssetPointers": true,
    "restoredModerationFlagsMismatch": false
  },
  {
    "assetId": "edge-3",
    "restoredVersionOlderThanDraft": false,
    "brokenAssetPointers": false,
    "restoredModerationFlagsMismatch": true
  }
]), null, 2));
