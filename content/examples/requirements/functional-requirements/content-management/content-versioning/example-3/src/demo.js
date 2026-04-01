function detectPublishConflict(requestedVersion, latestApprovedVersion) {
  return {
    blocked: requestedVersion < latestApprovedVersion,
    reason: requestedVersion < latestApprovedVersion ? "stale-publish-attempt" : "safe-to-promote"
  };
}

console.log(detectPublishConflict(13, 14));
