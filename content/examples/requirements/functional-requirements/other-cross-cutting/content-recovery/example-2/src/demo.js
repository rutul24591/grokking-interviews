function evaluateRecoveryCandidates(candidates) {
  return candidates.map((entry) => ({
    assetId: entry.assetId,
    allowRestore: entry.snapshotHealthy && !entry.newerEditsPresent && !entry.legalHold,
    branchReviewRequired: entry.multipleVersionBranches,
    forcePreview: entry.mediaAssetsMissing || entry.embedsBroken
  }));
}

console.log(JSON.stringify(evaluateRecoveryCandidates([
  {
    "assetId": "r-1",
    "snapshotHealthy": true,
    "newerEditsPresent": false,
    "legalHold": false,
    "multipleVersionBranches": false,
    "mediaAssetsMissing": false,
    "embedsBroken": false
  },
  {
    "assetId": "r-2",
    "snapshotHealthy": true,
    "newerEditsPresent": true,
    "legalHold": false,
    "multipleVersionBranches": true,
    "mediaAssetsMissing": false,
    "embedsBroken": true
  },
  {
    "assetId": "r-3",
    "snapshotHealthy": false,
    "newerEditsPresent": false,
    "legalHold": true,
    "multipleVersionBranches": false,
    "mediaAssetsMissing": true,
    "embedsBroken": false
  }
]), null, 2));
