function evaluateExportBundles(bundles) {
  return bundles.map((entry) => ({
    bundleId: entry.bundleId,
    buildFullArchive: entry.identityVerified && entry.scopeComplete && !entry.requiresRedaction,
    fallBackToSegmentedBundle: entry.largeMediaSet || entry.slowDependencyPresent,
    manualRedactionReview: entry.requiresRedaction || entry.thirdPartyDataIncluded
  }));
}

console.log(JSON.stringify(evaluateExportBundles([
  {
    "bundleId": "bun-1",
    "identityVerified": true,
    "scopeComplete": true,
    "requiresRedaction": false,
    "largeMediaSet": false,
    "slowDependencyPresent": false,
    "thirdPartyDataIncluded": false
  },
  {
    "bundleId": "bun-2",
    "identityVerified": true,
    "scopeComplete": true,
    "requiresRedaction": false,
    "largeMediaSet": true,
    "slowDependencyPresent": true,
    "thirdPartyDataIncluded": false
  },
  {
    "bundleId": "bun-3",
    "identityVerified": false,
    "scopeComplete": false,
    "requiresRedaction": true,
    "largeMediaSet": false,
    "slowDependencyPresent": false,
    "thirdPartyDataIncluded": true
  }
]), null, 2));
