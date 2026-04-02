function evaluateUserMutingEdges(policies) {
  return policies.map((entry) => ({
    policyId: entry.policyId,
    dropDuplicateMute: entry.sameActorSameScope,
    restoreDelivery: entry.snoozeExpired && !entry.accountMute,
    rebuildUnreadCounts: entry.suppressedNotificationsResurfaced
  }));
}

console.log(JSON.stringify(evaluateUserMutingEdges([
  {
    "policyId": "edge-1",
    "sameActorSameScope": true,
    "snoozeExpired": false,
    "accountMute": true,
    "suppressedNotificationsResurfaced": false
  },
  {
    "policyId": "edge-2",
    "sameActorSameScope": false,
    "snoozeExpired": true,
    "accountMute": false,
    "suppressedNotificationsResurfaced": false
  },
  {
    "policyId": "edge-3",
    "sameActorSameScope": false,
    "snoozeExpired": false,
    "accountMute": true,
    "suppressedNotificationsResurfaced": true
  }
]), null, 2));
