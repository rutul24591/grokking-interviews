function evaluateSpamDetectionEdges(actors) {
  return actors.map((entry) => ({
    actorId: entry.actorId,
    quarantineCampaign: entry.burstReturnedAfterCooldown,
    releaseThrottle: entry.appealVerifiedHuman && !entry.repeatSignal,
    rollbackModelWeight: entry.recentDeployment && entry.falsePositiveRateSpike
  }));
}

console.log(JSON.stringify(evaluateSpamDetectionEdges([
  {
    "actorId": "edge-1",
    "burstReturnedAfterCooldown": true,
    "appealVerifiedHuman": false,
    "repeatSignal": true,
    "recentDeployment": false,
    "falsePositiveRateSpike": false
  },
  {
    "actorId": "edge-2",
    "burstReturnedAfterCooldown": false,
    "appealVerifiedHuman": true,
    "repeatSignal": false,
    "recentDeployment": false,
    "falsePositiveRateSpike": false
  },
  {
    "actorId": "edge-3",
    "burstReturnedAfterCooldown": false,
    "appealVerifiedHuman": false,
    "repeatSignal": false,
    "recentDeployment": true,
    "falsePositiveRateSpike": true
  }
]), null, 2));
