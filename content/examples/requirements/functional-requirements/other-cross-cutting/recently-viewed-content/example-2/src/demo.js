function evaluateRecentlyViewedContent(subjects) {
  return subjects.map((entry) => ({
    subjectId: entry.subjectId,
    appendView: entry.captureEnabled && !entry.privateMode,
    fallbackToSessionOnly: entry.privateMode || entry.retentionStrict,
    repairOrdering: entry.crossDeviceLag || entry.duplicateViewIds
  }));
}

console.log(JSON.stringify(evaluateRecentlyViewedContent([
  {
    "subjectId": "rv-1",
    "captureEnabled": true,
    "privateMode": false,
    "retentionStrict": false,
    "crossDeviceLag": false,
    "duplicateViewIds": false
  },
  {
    "subjectId": "rv-2",
    "captureEnabled": true,
    "privateMode": true,
    "retentionStrict": false,
    "crossDeviceLag": true,
    "duplicateViewIds": false
  },
  {
    "subjectId": "rv-3",
    "captureEnabled": false,
    "privateMode": false,
    "retentionStrict": true,
    "crossDeviceLag": false,
    "duplicateViewIds": true
  }
]), null, 2));
