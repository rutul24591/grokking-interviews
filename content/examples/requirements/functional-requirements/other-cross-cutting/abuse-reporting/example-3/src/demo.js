function evaluateAbuseReportingEdges(cases) {
  return cases.map((entry) => ({
    caseId: entry.caseId,
    mergeIntoCanonical: entry.duplicateReporterCluster && !entry.newEvidence,
    reopenInvestigation: entry.appealAccepted && entry.safetySignalsPersist,
    holdEnforcement: entry.evidenceExpired || entry.reporterUnreachable
  }));
}

console.log(JSON.stringify(evaluateAbuseReportingEdges([
  {
    "caseId": "edge-a",
    "duplicateReporterCluster": true,
    "newEvidence": false,
    "appealAccepted": false,
    "safetySignalsPersist": false,
    "evidenceExpired": false,
    "reporterUnreachable": false
  },
  {
    "caseId": "edge-b",
    "duplicateReporterCluster": false,
    "newEvidence": true,
    "appealAccepted": true,
    "safetySignalsPersist": true,
    "evidenceExpired": false,
    "reporterUnreachable": false
  },
  {
    "caseId": "edge-c",
    "duplicateReporterCluster": false,
    "newEvidence": false,
    "appealAccepted": false,
    "safetySignalsPersist": false,
    "evidenceExpired": true,
    "reporterUnreachable": true
  }
]), null, 2));
