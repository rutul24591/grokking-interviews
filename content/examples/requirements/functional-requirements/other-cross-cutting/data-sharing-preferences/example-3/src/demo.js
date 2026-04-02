function evaluateSharingEdges(profiles) {
  return profiles.map((entry) => ({
    profileId: entry.profileId,
    freezeExportJob: entry.recentOptOut && entry.exportBatchOpen,
    queuePartnerDelete: entry.partnerStillHasHistoricalCopy,
    invalidatePreferencePreview: entry.policyVersionChangedAfterSave
  }));
}

console.log(JSON.stringify(evaluateSharingEdges([
  {
    "profileId": "edge-1",
    "recentOptOut": true,
    "exportBatchOpen": true,
    "partnerStillHasHistoricalCopy": false,
    "policyVersionChangedAfterSave": false
  },
  {
    "profileId": "edge-2",
    "recentOptOut": false,
    "exportBatchOpen": false,
    "partnerStillHasHistoricalCopy": true,
    "policyVersionChangedAfterSave": false
  },
  {
    "profileId": "edge-3",
    "recentOptOut": false,
    "exportBatchOpen": false,
    "partnerStillHasHistoricalCopy": false,
    "policyVersionChangedAfterSave": true
  }
]), null, 2));
