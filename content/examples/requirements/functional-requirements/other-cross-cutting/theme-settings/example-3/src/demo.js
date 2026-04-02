function evaluateThemeEdges(profiles) {
  return profiles.map((entry) => ({
    profileId: entry.profileId,
    resetBrokenThemeCache: entry.versionedAssetsMismatch,
    replayIframeThemeSync: entry.embeddedWidgetOutOfDate,
    preserveAccessibilityOverride: entry.highContrastEnabled
  }));
}

console.log(JSON.stringify(evaluateThemeEdges([
  {
    "profileId": "edge-1",
    "versionedAssetsMismatch": true,
    "embeddedWidgetOutOfDate": false,
    "highContrastEnabled": false
  },
  {
    "profileId": "edge-2",
    "versionedAssetsMismatch": false,
    "embeddedWidgetOutOfDate": true,
    "highContrastEnabled": false
  },
  {
    "profileId": "edge-3",
    "versionedAssetsMismatch": false,
    "embeddedWidgetOutOfDate": false,
    "highContrastEnabled": true
  }
]), null, 2));
