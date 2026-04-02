function evaluateNotificationMuting(profiles) {
  return profiles.map((entry) => ({
    profileId: entry.profileId,
    suppressCategory: entry.categoryMuted && !entry.securityNotice,
    applyThreadMute: entry.threadMuted && !entry.threadMuteExpired,
    needsSurfaceRepair: entry.pushMuted !== entry.inboxMuted
  }));
}

console.log(JSON.stringify(evaluateNotificationMuting([
  {
    "profileId": "nm-1",
    "categoryMuted": true,
    "securityNotice": false,
    "threadMuted": true,
    "threadMuteExpired": false,
    "pushMuted": true,
    "inboxMuted": false
  },
  {
    "profileId": "nm-2",
    "categoryMuted": true,
    "securityNotice": true,
    "threadMuted": false,
    "threadMuteExpired": false,
    "pushMuted": false,
    "inboxMuted": false
  },
  {
    "profileId": "nm-3",
    "categoryMuted": false,
    "securityNotice": false,
    "threadMuted": true,
    "threadMuteExpired": true,
    "pushMuted": false,
    "inboxMuted": false
  }
]), null, 2));
