function evaluateProfileVisibility(profiles) {
  return profiles.map((entry) => ({
    profileId: entry.profileId,
    showInSearch: entry.visibilityLevel === "public" && !entry.safetyLock,
    limitFieldExposure: entry.visibilityLevel !== "public" || entry.sensitiveFieldPresent,
    needsPreviewWarning: entry.searchCacheStale || entry.cardRendererOld
  }));
}

console.log(JSON.stringify(evaluateProfileVisibility([
  {
    "profileId": "pv-1",
    "visibilityLevel": "public",
    "safetyLock": false,
    "sensitiveFieldPresent": false,
    "searchCacheStale": false,
    "cardRendererOld": false
  },
  {
    "profileId": "pv-2",
    "visibilityLevel": "followers",
    "safetyLock": false,
    "sensitiveFieldPresent": true,
    "searchCacheStale": true,
    "cardRendererOld": false
  },
  {
    "profileId": "pv-3",
    "visibilityLevel": "private",
    "safetyLock": true,
    "sensitiveFieldPresent": false,
    "searchCacheStale": false,
    "cardRendererOld": true
  }
]), null, 2));
