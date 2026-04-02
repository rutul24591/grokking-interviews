function evaluateMutingEdges(profiles) {
  return profiles.map((entry) => ({
    profileId: entry.profileId,
    rebuildUnreadState: entry.unreadCountIgnoredMute,
    cancelPendingDigest: entry.muteAddedAfterDigestQueued,
    restoreDefaultAfterExpiry: entry.timeBoxExpired && !entry.categoryMuted
  }));
}

console.log(JSON.stringify(evaluateMutingEdges([
  {
    "profileId": "edge-1",
    "unreadCountIgnoredMute": true,
    "muteAddedAfterDigestQueued": false,
    "timeBoxExpired": false,
    "categoryMuted": true
  },
  {
    "profileId": "edge-2",
    "unreadCountIgnoredMute": false,
    "muteAddedAfterDigestQueued": true,
    "timeBoxExpired": false,
    "categoryMuted": true
  },
  {
    "profileId": "edge-3",
    "unreadCountIgnoredMute": false,
    "muteAddedAfterDigestQueued": false,
    "timeBoxExpired": true,
    "categoryMuted": false
  }
]), null, 2));
