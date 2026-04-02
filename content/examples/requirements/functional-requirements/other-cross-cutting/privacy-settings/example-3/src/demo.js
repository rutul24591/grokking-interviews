function evaluatePrivacyEdges(profiles) {
  return profiles.map((entry) => ({
    profileId: entry.profileId,
    rollBackUnsafeSave: entry.versionConflictDetected,
    invalidateCachedPreview: entry.visibilityChangedAfterShareLinkIssued,
    reapplyProcessingHold: entry.partnerResyncFailed
  }));
}

console.log(JSON.stringify(evaluatePrivacyEdges([
  {
    "profileId": "edge-1",
    "versionConflictDetected": true,
    "visibilityChangedAfterShareLinkIssued": false,
    "partnerResyncFailed": false
  },
  {
    "profileId": "edge-2",
    "versionConflictDetected": false,
    "visibilityChangedAfterShareLinkIssued": true,
    "partnerResyncFailed": false
  },
  {
    "profileId": "edge-3",
    "versionConflictDetected": false,
    "visibilityChangedAfterShareLinkIssued": false,
    "partnerResyncFailed": true
  }
]), null, 2));
