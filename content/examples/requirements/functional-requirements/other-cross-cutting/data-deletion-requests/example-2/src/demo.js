function evaluateDeletionRequests(requests) {
  return requests.map((entry) => ({
    requestId: entry.requestId,
    canScheduleDeletion: entry.identityVerified && !entry.activeLegalHold && !entry.sharedOwnershipConflict,
    needsScopeSplit: entry.sharedOwnershipConflict || entry.financialRecordsPresent,
    notifyCompliance: entry.crossRegionData || entry.childAccountLinked
  }));
}

console.log(JSON.stringify(evaluateDeletionRequests([
  {
    "requestId": "del-a",
    "identityVerified": true,
    "activeLegalHold": false,
    "sharedOwnershipConflict": false,
    "financialRecordsPresent": false,
    "crossRegionData": false,
    "childAccountLinked": false
  },
  {
    "requestId": "del-b",
    "identityVerified": true,
    "activeLegalHold": false,
    "sharedOwnershipConflict": true,
    "financialRecordsPresent": true,
    "crossRegionData": false,
    "childAccountLinked": false
  },
  {
    "requestId": "del-c",
    "identityVerified": false,
    "activeLegalHold": true,
    "sharedOwnershipConflict": false,
    "financialRecordsPresent": false,
    "crossRegionData": true,
    "childAccountLinked": true
  }
]), null, 2));
