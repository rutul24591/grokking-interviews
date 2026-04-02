function evaluateExportEdges(bundles) {
  return bundles.map((entry) => ({
    bundleId: entry.bundleId,
    expireDeliveryLink: entry.downloadWindowExpired,
    rebuildCorruptSegment: entry.hashMismatchDetected,
    dropCachedExport: entry.userRequestedFreshExport
  }));
}

console.log(JSON.stringify(evaluateExportEdges([
  {
    "bundleId": "edge-1",
    "downloadWindowExpired": true,
    "hashMismatchDetected": false,
    "userRequestedFreshExport": false
  },
  {
    "bundleId": "edge-2",
    "downloadWindowExpired": false,
    "hashMismatchDetected": true,
    "userRequestedFreshExport": false
  },
  {
    "bundleId": "edge-3",
    "downloadWindowExpired": false,
    "hashMismatchDetected": false,
    "userRequestedFreshExport": true
  }
]), null, 2));
