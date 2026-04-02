function evaluateNotificationPreferences(profiles) {
  return profiles.map((entry) => ({
    profileId: entry.profileId,
    preferredChannel: entry.pushEnabled ? "push" : entry.emailEnabled ? "email" : "inbox",
    hasRoutingGap: !entry.pushEnabled && !entry.emailEnabled && !entry.inboxEnabled,
    needsFallbackPreview: entry.channelSpecificCategories > 0
  }));
}

console.log(JSON.stringify(evaluateNotificationPreferences([
  {
    "profileId": "np-1",
    "pushEnabled": true,
    "emailEnabled": true,
    "inboxEnabled": true,
    "channelSpecificCategories": 2
  },
  {
    "profileId": "np-2",
    "pushEnabled": false,
    "emailEnabled": false,
    "inboxEnabled": true,
    "channelSpecificCategories": 1
  },
  {
    "profileId": "np-3",
    "pushEnabled": false,
    "emailEnabled": false,
    "inboxEnabled": false,
    "channelSpecificCategories": 0
  }
]), null, 2));
