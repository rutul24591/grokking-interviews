function evaluateRecentlyViewedEdges(subjects) {
  return subjects.map((entry) => ({
    subjectId: entry.subjectId,
    dropDeletedItem: entry.itemNoLongerVisible,
    mergeSessionHistory: entry.offlineViewsBuffered,
    recomputePrivacyMask: entry.modeChangedAfterCapture
  }));
}

console.log(JSON.stringify(evaluateRecentlyViewedEdges([
  {
    "subjectId": "edge-1",
    "itemNoLongerVisible": true,
    "offlineViewsBuffered": false,
    "modeChangedAfterCapture": false
  },
  {
    "subjectId": "edge-2",
    "itemNoLongerVisible": false,
    "offlineViewsBuffered": true,
    "modeChangedAfterCapture": false
  },
  {
    "subjectId": "edge-3",
    "itemNoLongerVisible": false,
    "offlineViewsBuffered": false,
    "modeChangedAfterCapture": true
  }
]), null, 2));
