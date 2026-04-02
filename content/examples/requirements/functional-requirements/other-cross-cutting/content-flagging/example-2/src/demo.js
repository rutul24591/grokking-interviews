function evaluateContentFlaggingDecisions(flags) {
  return flags.map((entry) => ({
    assetId: entry.assetId,
    route: entry.childSafetyRisk ? "critical-escalation" : entry.flagDensity > 0.2 ? "high-confidence-review" : "sampled-review",
    hideFromFeed: entry.flagDensity > 0.12 || entry.trustedReporterPresent,
    needsContextFetch: entry.mediaAttachment && !entry.previousPolicyMatch
  }));
}

console.log(JSON.stringify(evaluateContentFlaggingDecisions([
  {
    "assetId": "asset-1",
    "childSafetyRisk": false,
    "flagDensity": 0.23,
    "trustedReporterPresent": true,
    "mediaAttachment": true,
    "previousPolicyMatch": false
  },
  {
    "assetId": "asset-2",
    "childSafetyRisk": true,
    "flagDensity": 0.04,
    "trustedReporterPresent": false,
    "mediaAttachment": false,
    "previousPolicyMatch": true
  },
  {
    "assetId": "asset-3",
    "childSafetyRisk": false,
    "flagDensity": 0.03,
    "trustedReporterPresent": false,
    "mediaAttachment": true,
    "previousPolicyMatch": true
  }
]), null, 2));
