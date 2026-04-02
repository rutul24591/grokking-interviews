function evaluateSpamDetectionSignals(signals) {
  return signals.map((entry) => ({
    actorId: entry.actorId,
    scoreBand: entry.linkBurst >= 8 || entry.copyPasteRatio > 0.9 ? "critical" : entry.linkBurst >= 4 ? "suspicious" : "watch",
    shadowThrottle: entry.newAccount && entry.audienceOverlapHigh,
    needsModelReview: entry.falsePositiveCluster || entry.localeDrift
  }));
}

console.log(JSON.stringify(evaluateSpamDetectionSignals([
  {
    "actorId": "acct-1",
    "linkBurst": 10,
    "copyPasteRatio": 0.95,
    "newAccount": true,
    "audienceOverlapHigh": true,
    "falsePositiveCluster": false,
    "localeDrift": false
  },
  {
    "actorId": "acct-2",
    "linkBurst": 5,
    "copyPasteRatio": 0.64,
    "newAccount": false,
    "audienceOverlapHigh": false,
    "falsePositiveCluster": true,
    "localeDrift": false
  },
  {
    "actorId": "acct-3",
    "linkBurst": 1,
    "copyPasteRatio": 0.22,
    "newAccount": false,
    "audienceOverlapHigh": false,
    "falsePositiveCluster": false,
    "localeDrift": true
  }
]), null, 2));
