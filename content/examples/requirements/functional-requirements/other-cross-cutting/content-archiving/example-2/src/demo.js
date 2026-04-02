function evaluateArchivingPlan(assets) {
  return assets.map((entry) => ({
    assetId: entry.assetId,
    canArchiveNow: entry.ownerConfirmed && !entry.legalHold && !entry.activeCampaign,
    requireSearchCleanup: entry.indexedInSearch || entry.cachedInFeed,
    scheduleArchiveWindow: entry.hasDependentRelease
  }));
}

console.log(JSON.stringify(evaluateArchivingPlan([
  {
    "assetId": "a-1",
    "ownerConfirmed": true,
    "legalHold": false,
    "activeCampaign": false,
    "indexedInSearch": true,
    "cachedInFeed": true,
    "hasDependentRelease": false
  },
  {
    "assetId": "a-2",
    "ownerConfirmed": true,
    "legalHold": false,
    "activeCampaign": true,
    "indexedInSearch": false,
    "cachedInFeed": false,
    "hasDependentRelease": true
  },
  {
    "assetId": "a-3",
    "ownerConfirmed": false,
    "legalHold": true,
    "activeCampaign": false,
    "indexedInSearch": true,
    "cachedInFeed": false,
    "hasDependentRelease": false
  }
]), null, 2));
