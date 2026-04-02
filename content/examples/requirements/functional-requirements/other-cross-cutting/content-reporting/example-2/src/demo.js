function evaluateContentReportingRoutes(reports) {
  return reports.map((entry) => ({
    reportId: entry.reportId,
    route: entry.legalNotice ? "legal-ops" : entry.highReachAsset ? "publisher-rapid-response" : "policy-queue",
    notifyPublisher: entry.verifiedReporter && !entry.childSafetyRisk,
    requireJurisdictionReview: entry.crossBorderClaim || entry.localCourtOrder
  }));
}

console.log(JSON.stringify(evaluateContentReportingRoutes([
  {
    "reportId": "rep-1",
    "legalNotice": false,
    "highReachAsset": true,
    "verifiedReporter": true,
    "childSafetyRisk": false,
    "crossBorderClaim": false,
    "localCourtOrder": false
  },
  {
    "reportId": "rep-2",
    "legalNotice": true,
    "highReachAsset": false,
    "verifiedReporter": true,
    "childSafetyRisk": false,
    "crossBorderClaim": true,
    "localCourtOrder": false
  },
  {
    "reportId": "rep-3",
    "legalNotice": false,
    "highReachAsset": false,
    "verifiedReporter": false,
    "childSafetyRisk": true,
    "crossBorderClaim": false,
    "localCourtOrder": false
  }
]), null, 2));
