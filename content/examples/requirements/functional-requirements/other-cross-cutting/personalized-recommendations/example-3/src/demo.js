function evaluateRecommendationEdges(subjects) {
  return subjects.map((entry) => ({
    subjectId: entry.subjectId,
    resetStaleProfile: entry.historyWindowExpired,
    dropUnsafeCandidate: entry.permissionCheckFailed,
    reseedDiversityPool: entry.topKCollapsed
  }));
}

console.log(JSON.stringify(evaluateRecommendationEdges([
  {
    "subjectId": "edge-1",
    "historyWindowExpired": true,
    "permissionCheckFailed": false,
    "topKCollapsed": false
  },
  {
    "subjectId": "edge-2",
    "historyWindowExpired": false,
    "permissionCheckFailed": true,
    "topKCollapsed": false
  },
  {
    "subjectId": "edge-3",
    "historyWindowExpired": false,
    "permissionCheckFailed": false,
    "topKCollapsed": true
  }
]), null, 2));
