function evaluateLanguageEdges(profiles) {
  return profiles.map((entry) => ({
    profileId: entry.profileId,
    invalidatePartialBundle: entry.bundleVersionSkew,
    pinLegacyLocale: entry.userLocaleDeprecated,
    rebuildPluralRules: entry.localeSwitchDuringDraftEdit
  }));
}

console.log(JSON.stringify(evaluateLanguageEdges([
  {
    "profileId": "edge-1",
    "bundleVersionSkew": true,
    "userLocaleDeprecated": false,
    "localeSwitchDuringDraftEdit": false
  },
  {
    "profileId": "edge-2",
    "bundleVersionSkew": false,
    "userLocaleDeprecated": true,
    "localeSwitchDuringDraftEdit": false
  },
  {
    "profileId": "edge-3",
    "bundleVersionSkew": false,
    "userLocaleDeprecated": false,
    "localeSwitchDuringDraftEdit": true
  }
]), null, 2));
