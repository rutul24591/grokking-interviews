function evaluateProfileVisibilityEdges(profiles) {
  return profiles.map((entry) => ({
    profileId: entry.profileId,
    invalidateSharedPreview: entry.visibilityChangedAfterShare,
    recomputeMentionEligibility: entry.followGraphChanged,
    blockCachedCard: entry.staleDirectoryEntry
  }));
}

console.log(JSON.stringify(evaluateProfileVisibilityEdges([
  {
    "profileId": "edge-1",
    "visibilityChangedAfterShare": true,
    "followGraphChanged": false,
    "staleDirectoryEntry": false
  },
  {
    "profileId": "edge-2",
    "visibilityChangedAfterShare": false,
    "followGraphChanged": true,
    "staleDirectoryEntry": false
  },
  {
    "profileId": "edge-3",
    "visibilityChangedAfterShare": false,
    "followGraphChanged": false,
    "staleDirectoryEntry": true
  }
]), null, 2));
