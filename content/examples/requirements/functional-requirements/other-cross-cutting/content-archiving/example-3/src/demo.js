function evaluateArchivingEdges(assets) {
  return assets.map((entry) => ({
    assetId: entry.assetId,
    replayArchiveJobs: entry.stalePublicCache,
    blockRestore: entry.dependencyMissing,
    keepRedirectAlive: entry.externalLinksRemainHighTraffic
  }));
}

console.log(JSON.stringify(evaluateArchivingEdges([
  {
    "assetId": "edge-1",
    "stalePublicCache": true,
    "dependencyMissing": false,
    "externalLinksRemainHighTraffic": false
  },
  {
    "assetId": "edge-2",
    "stalePublicCache": false,
    "dependencyMissing": true,
    "externalLinksRemainHighTraffic": false
  },
  {
    "assetId": "edge-3",
    "stalePublicCache": false,
    "dependencyMissing": false,
    "externalLinksRemainHighTraffic": true
  }
]), null, 2));
