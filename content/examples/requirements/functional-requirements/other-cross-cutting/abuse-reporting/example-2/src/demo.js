function evaluateAbuseReportingQueue(reports) {
  return reports.map((entry) => ({
    reportId: entry.reportId,
    route: entry.offPlatformThreat || entry.severity >= 9 ? "priority-trust-queue" : entry.severity >= 6 ? "human-review" : "standard-triage",
    freezeActorMessaging: entry.repeatOffender || entry.reporterAtRisk,
    needsAppealPath: entry.accountAgeDays > 30 && entry.confidence < 0.78
  }));
}

console.log(JSON.stringify(evaluateAbuseReportingQueue([
  {
    "reportId": "ab-1",
    "severity": 9,
    "offPlatformThreat": true,
    "repeatOffender": true,
    "reporterAtRisk": true,
    "accountAgeDays": 140,
    "confidence": 0.93
  },
  {
    "reportId": "ab-2",
    "severity": 6,
    "offPlatformThreat": false,
    "repeatOffender": false,
    "reporterAtRisk": false,
    "accountAgeDays": 540,
    "confidence": 0.72
  },
  {
    "reportId": "ab-3",
    "severity": 3,
    "offPlatformThreat": false,
    "repeatOffender": false,
    "reporterAtRisk": false,
    "accountAgeDays": 8,
    "confidence": 0.88
  }
]), null, 2));
