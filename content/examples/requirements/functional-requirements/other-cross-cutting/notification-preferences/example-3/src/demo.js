function evaluateNotificationPreferenceEdges(profiles) {
  return profiles.map((entry) => ({
    profileId: entry.profileId,
    repairLegacyMapping: entry.legacyCategoryNamePresent,
    rollBackInvalidSave: entry.crossChannelConflict,
    suppressDuplicateDelivery: entry.sameCategoryOnMultipleFallbacks
  }));
}

console.log(JSON.stringify(evaluateNotificationPreferenceEdges([
  {
    "profileId": "edge-1",
    "legacyCategoryNamePresent": true,
    "crossChannelConflict": false,
    "sameCategoryOnMultipleFallbacks": false
  },
  {
    "profileId": "edge-2",
    "legacyCategoryNamePresent": false,
    "crossChannelConflict": true,
    "sameCategoryOnMultipleFallbacks": false
  },
  {
    "profileId": "edge-3",
    "legacyCategoryNamePresent": false,
    "crossChannelConflict": false,
    "sameCategoryOnMultipleFallbacks": true
  }
]), null, 2));
