function evaluateEmailDigestEdges(profiles) {
  return profiles.map((entry) => ({
    profileId: entry.profileId,
    fallbackToSummaryOnly: entry.noEligibleItems,
    delayNextDigest: entry.recentFrequencyChange,
    invalidateLegacyCadence: entry.unsupportedLegacyValue
  }));
}

console.log(JSON.stringify(evaluateEmailDigestEdges([
  {
    "profileId": "edge-1",
    "noEligibleItems": true,
    "recentFrequencyChange": false,
    "unsupportedLegacyValue": false
  },
  {
    "profileId": "edge-2",
    "noEligibleItems": false,
    "recentFrequencyChange": true,
    "unsupportedLegacyValue": false
  },
  {
    "profileId": "edge-3",
    "noEligibleItems": false,
    "recentFrequencyChange": false,
    "unsupportedLegacyValue": true
  }
]), null, 2));
