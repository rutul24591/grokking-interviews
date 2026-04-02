function evaluateSchedulingEdges(releases) {
  return releases.map((entry) => ({
    releaseId: entry.releaseId,
    holdAutopublish: entry.assetBecameUnavailable,
    recalculateTimezone: entry.regionSetChangedLate,
    invalidateStaleTimer: entry.scheduleEditedAfterQueueing
  }));
}

console.log(JSON.stringify(evaluateSchedulingEdges([
  {
    "releaseId": "edge-1",
    "assetBecameUnavailable": true,
    "regionSetChangedLate": false,
    "scheduleEditedAfterQueueing": false
  },
  {
    "releaseId": "edge-2",
    "assetBecameUnavailable": false,
    "regionSetChangedLate": true,
    "scheduleEditedAfterQueueing": false
  },
  {
    "releaseId": "edge-3",
    "assetBecameUnavailable": false,
    "regionSetChangedLate": false,
    "scheduleEditedAfterQueueing": true
  }
]), null, 2));
