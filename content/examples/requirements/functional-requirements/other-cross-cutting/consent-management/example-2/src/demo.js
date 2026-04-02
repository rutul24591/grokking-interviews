function evaluateConsentScope(records) {
  return records.map((entry) => ({
    recordId: entry.recordId,
    canProcessOptionalData: entry.marketingAccepted && entry.noticeVersionCurrent && !entry.withdrawn,
    needsReconsent: !entry.noticeVersionCurrent || entry.jurisdictionChanged,
    fanoutSuppression: entry.downstreamLagging || entry.partnerExportEnabled && !entry.partnerConsent
  }));
}

console.log(JSON.stringify(evaluateConsentScope([
  {
    "recordId": "cons-1",
    "marketingAccepted": true,
    "noticeVersionCurrent": true,
    "withdrawn": false,
    "jurisdictionChanged": false,
    "downstreamLagging": false,
    "partnerExportEnabled": true,
    "partnerConsent": true
  },
  {
    "recordId": "cons-2",
    "marketingAccepted": true,
    "noticeVersionCurrent": false,
    "withdrawn": false,
    "jurisdictionChanged": false,
    "downstreamLagging": true,
    "partnerExportEnabled": false,
    "partnerConsent": false
  },
  {
    "recordId": "cons-3",
    "marketingAccepted": false,
    "noticeVersionCurrent": true,
    "withdrawn": true,
    "jurisdictionChanged": true,
    "downstreamLagging": false,
    "partnerExportEnabled": true,
    "partnerConsent": false
  }
]), null, 2));
