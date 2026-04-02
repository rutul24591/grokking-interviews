function evaluateEmailDigestPreferences(profiles) {
  return profiles.map((entry) => ({
    profileId: entry.profileId,
    effectiveCadence: entry.pauseAll ? "paused" : entry.weeklyPreferred ? "weekly" : entry.dailyPreferred ? "daily" : "immediate",
    dropMutedTopic: entry.topicMutedElsewhere || entry.deliveryBudgetExceeded,
    showDigestPreview: !entry.pauseAll && entry.subscribedTopics > 0
  }));
}

console.log(JSON.stringify(evaluateEmailDigestPreferences([
  {
    "profileId": "ed-1",
    "pauseAll": false,
    "weeklyPreferred": true,
    "dailyPreferred": false,
    "topicMutedElsewhere": false,
    "deliveryBudgetExceeded": false,
    "subscribedTopics": 5
  },
  {
    "profileId": "ed-2",
    "pauseAll": false,
    "weeklyPreferred": false,
    "dailyPreferred": true,
    "topicMutedElsewhere": true,
    "deliveryBudgetExceeded": false,
    "subscribedTopics": 3
  },
  {
    "profileId": "ed-3",
    "pauseAll": true,
    "weeklyPreferred": false,
    "dailyPreferred": false,
    "topicMutedElsewhere": false,
    "deliveryBudgetExceeded": true,
    "subscribedTopics": 0
  }
]), null, 2));
