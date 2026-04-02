function evaluateFrequencyEdges(profiles) {
  return profiles.map((entry) => ({
    profileId: entry.profileId,
    dropExpiredBacklog: entry.backlogAgeHours > 24,
    recomputeBudget: entry.channelPolicyChanged,
    blockBurstReplay: entry.backlogReleasedTooQuickly
  }));
}

console.log(JSON.stringify(evaluateFrequencyEdges([
  {
    "profileId": "edge-1",
    "backlogAgeHours": 36,
    "channelPolicyChanged": false,
    "backlogReleasedTooQuickly": false
  },
  {
    "profileId": "edge-2",
    "backlogAgeHours": 4,
    "channelPolicyChanged": true,
    "backlogReleasedTooQuickly": false
  },
  {
    "profileId": "edge-3",
    "backlogAgeHours": 2,
    "channelPolicyChanged": false,
    "backlogReleasedTooQuickly": true
  }
]), null, 2));
