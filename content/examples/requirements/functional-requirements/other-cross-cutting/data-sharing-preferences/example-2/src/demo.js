function evaluateSharingPreferences(profiles) {
  return profiles.map((entry) => ({
    profileId: entry.profileId,
    allowPartnerExport: entry.partnerToggle && entry.partnerConsentCurrent && !entry.regionBlocked,
    downgradeToInternalOnly: !entry.partnerConsentCurrent || entry.regionBlocked,
    needsPartnerReconciliation: entry.partnerAckLagging || entry.scopeMismatch
  }));
}

console.log(JSON.stringify(evaluateSharingPreferences([
  {
    "profileId": "sp-1",
    "partnerToggle": true,
    "partnerConsentCurrent": true,
    "regionBlocked": false,
    "partnerAckLagging": false,
    "scopeMismatch": false
  },
  {
    "profileId": "sp-2",
    "partnerToggle": true,
    "partnerConsentCurrent": false,
    "regionBlocked": false,
    "partnerAckLagging": true,
    "scopeMismatch": false
  },
  {
    "profileId": "sp-3",
    "partnerToggle": false,
    "partnerConsentCurrent": true,
    "regionBlocked": true,
    "partnerAckLagging": false,
    "scopeMismatch": true
  }
]), null, 2));
