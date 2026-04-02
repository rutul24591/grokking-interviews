function evaluateSchedulingReadiness(releases) {
  return releases.map((entry) => ({
    releaseId: entry.releaseId,
    readyForSchedule: entry.validationPassed && entry.assetsReady && !entry.legalReviewPending,
    needsWindowShift: entry.quietHoursConflict || entry.campaignCollision,
    requireManualRelease: entry.authorApprovalMissing || entry.crossRegionLaunch
  }));
}

console.log(JSON.stringify(evaluateSchedulingReadiness([
  {
    "releaseId": "s-1",
    "validationPassed": true,
    "assetsReady": true,
    "legalReviewPending": false,
    "quietHoursConflict": false,
    "campaignCollision": false,
    "authorApprovalMissing": false,
    "crossRegionLaunch": false
  },
  {
    "releaseId": "s-2",
    "validationPassed": true,
    "assetsReady": false,
    "legalReviewPending": false,
    "quietHoursConflict": true,
    "campaignCollision": false,
    "authorApprovalMissing": false,
    "crossRegionLaunch": true
  },
  {
    "releaseId": "s-3",
    "validationPassed": false,
    "assetsReady": true,
    "legalReviewPending": true,
    "quietHoursConflict": false,
    "campaignCollision": true,
    "authorApprovalMissing": true,
    "crossRegionLaunch": false
  }
]), null, 2));
