function evaluatePermissionManagement(subjects) {
  return subjects.map((entry) => ({
    subjectId: entry.subjectId,
    grantEffectiveAccess: entry.roleSatisfied && !entry.expiredElevation,
    requireDriftReview: entry.directGrantOutsideRole || entry.groupSyncLag,
    showTemporaryElevation: entry.expiringSoon
  }));
}

console.log(JSON.stringify(evaluatePermissionManagement([
  {
    "subjectId": "pm-1",
    "roleSatisfied": true,
    "expiredElevation": false,
    "directGrantOutsideRole": false,
    "groupSyncLag": false,
    "expiringSoon": false
  },
  {
    "subjectId": "pm-2",
    "roleSatisfied": true,
    "expiredElevation": false,
    "directGrantOutsideRole": true,
    "groupSyncLag": true,
    "expiringSoon": true
  },
  {
    "subjectId": "pm-3",
    "roleSatisfied": false,
    "expiredElevation": true,
    "directGrantOutsideRole": false,
    "groupSyncLag": false,
    "expiringSoon": false
  }
]), null, 2));
