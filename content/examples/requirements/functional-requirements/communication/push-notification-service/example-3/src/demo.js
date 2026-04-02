function detectPushFailures(cases) {
  return cases.map((entry) => ({
    batch: entry.batch,
    purgeTokens: entry.invalidTokenCount > 0,
    replaySegment: entry.segmentLagSeconds > 60,
    stopDuplicateCampaign: entry.sameCampaignId && entry.sameAudienceWindow
  }));
}

console.log(JSON.stringify(detectPushFailures([
  { batch: "critical", invalidTokenCount: 0, segmentLagSeconds: 12, sameCampaignId: false, sameAudienceWindow: false },
  { batch: "promo", invalidTokenCount: 40, segmentLagSeconds: 140, sameCampaignId: true, sameAudienceWindow: true },
  { batch: "cleanup", invalidTokenCount: 8, segmentLagSeconds: 10, sameCampaignId: false, sameAudienceWindow: false }
]), null, 2));
