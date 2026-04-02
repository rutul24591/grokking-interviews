function evaluatePersonalizedRecommendations(subjects) {
  return subjects.map((entry) => ({
    subjectId: entry.subjectId,
    servePersonalizedFeed: entry.historyDepth >= 5 && !entry.privacyOptOut,
    fallBackToContextual: entry.historyDepth < 5 || entry.collabCandidatesMissing,
    needsRankingReview: entry.policySuppressedCandidate || entry.diversityFloorMissed
  }));
}

console.log(JSON.stringify(evaluatePersonalizedRecommendations([
  {
    "subjectId": "pr-1",
    "historyDepth": 12,
    "privacyOptOut": false,
    "collabCandidatesMissing": false,
    "policySuppressedCandidate": false,
    "diversityFloorMissed": false
  },
  {
    "subjectId": "pr-2",
    "historyDepth": 2,
    "privacyOptOut": false,
    "collabCandidatesMissing": true,
    "policySuppressedCandidate": false,
    "diversityFloorMissed": true
  },
  {
    "subjectId": "pr-3",
    "historyDepth": 8,
    "privacyOptOut": true,
    "collabCandidatesMissing": false,
    "policySuppressedCandidate": true,
    "diversityFloorMissed": false
  }
]), null, 2));
