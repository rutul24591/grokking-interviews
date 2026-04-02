function evaluateUserMutingPolicies(policies) {
  return policies.map((entry) => ({
    policyId: entry.policyId,
    muteScope: entry.threadSpecific ? "thread-only" : entry.channelSpecific ? "channel-scope" : "account-scope",
    suppressPush: entry.mobileNotificationsEnabled && !entry.expired,
    needsPrecedenceCheck: entry.accountMute && entry.threadUnmute
  }));
}

console.log(JSON.stringify(evaluateUserMutingPolicies([
  {
    "policyId": "mute-1",
    "threadSpecific": false,
    "channelSpecific": false,
    "mobileNotificationsEnabled": true,
    "expired": false,
    "accountMute": true,
    "threadUnmute": false
  },
  {
    "policyId": "mute-2",
    "threadSpecific": true,
    "channelSpecific": false,
    "mobileNotificationsEnabled": true,
    "expired": false,
    "accountMute": true,
    "threadUnmute": true
  },
  {
    "policyId": "mute-3",
    "threadSpecific": false,
    "channelSpecific": true,
    "mobileNotificationsEnabled": false,
    "expired": true,
    "accountMute": false,
    "threadUnmute": false
  }
]), null, 2));
