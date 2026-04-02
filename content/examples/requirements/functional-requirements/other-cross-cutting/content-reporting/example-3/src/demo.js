function evaluateContentReportingEdges(reports) {
  return reports.map((entry) => ({
    reportId: entry.reportId,
    holdPublisherNotice: entry.reporterAnonymityRequired,
    reopenAfterEdit: entry.publisherEditedAsset && entry.originalViolationPatternPersists,
    expireDraftDecision: entry.ownerResponseWindowExpired && !entry.finalizedDecision
  }));
}

console.log(JSON.stringify(evaluateContentReportingEdges([
  {
    "reportId": "edge-1",
    "reporterAnonymityRequired": true,
    "publisherEditedAsset": false,
    "originalViolationPatternPersists": false,
    "ownerResponseWindowExpired": false,
    "finalizedDecision": false
  },
  {
    "reportId": "edge-2",
    "reporterAnonymityRequired": false,
    "publisherEditedAsset": true,
    "originalViolationPatternPersists": true,
    "ownerResponseWindowExpired": false,
    "finalizedDecision": false
  },
  {
    "reportId": "edge-3",
    "reporterAnonymityRequired": false,
    "publisherEditedAsset": false,
    "originalViolationPatternPersists": false,
    "ownerResponseWindowExpired": true,
    "finalizedDecision": false
  }
]), null, 2));
