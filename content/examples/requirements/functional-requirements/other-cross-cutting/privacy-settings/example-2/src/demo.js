function evaluatePrivacySettings(profiles) {
  return profiles.map((entry) => ({
    profileId: entry.profileId,
    applyPrivateDefaults: entry.newAccount && !entry.explicitShareOverride,
    downgradeRecommendations: entry.profileHidden || entry.adsPersonalizationOff,
    needsDeviceResync: entry.staleMobileState || entry.partnerSuppressionLag
  }));
}

console.log(JSON.stringify(evaluatePrivacySettings([
  {
    "profileId": "pv-1",
    "newAccount": true,
    "explicitShareOverride": false,
    "profileHidden": true,
    "adsPersonalizationOff": true,
    "staleMobileState": false,
    "partnerSuppressionLag": false
  },
  {
    "profileId": "pv-2",
    "newAccount": false,
    "explicitShareOverride": true,
    "profileHidden": false,
    "adsPersonalizationOff": true,
    "staleMobileState": true,
    "partnerSuppressionLag": false
  },
  {
    "profileId": "pv-3",
    "newAccount": false,
    "explicitShareOverride": false,
    "profileHidden": false,
    "adsPersonalizationOff": false,
    "staleMobileState": false,
    "partnerSuppressionLag": true
  }
]), null, 2));
