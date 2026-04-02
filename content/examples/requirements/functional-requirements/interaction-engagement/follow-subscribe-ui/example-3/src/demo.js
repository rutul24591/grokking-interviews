function detectFollowEdgeCases(targets) {
  const inconsistent = targets.filter((target) => target.feedState !== target.notificationState).map((target) => target.id);
  const staleEntitlements = targets.filter((target) => target.paywalled && target.feedState).map((target) => target.id);
  return {
    inconsistent,
    staleEntitlements,
    reconcile: inconsistent.length > 0 || staleEntitlements.length > 0,
    downgradeToDigest: targets.some((target) => target.deliveryFailures > 2)
  };
}

console.log(detectFollowEdgeCases([
  { id: "fs-1", feedState: true, notificationState: false, paywalled: false, deliveryFailures: 0 },
  { id: "fs-2", feedState: true, notificationState: true, paywalled: true, deliveryFailures: 3 }
]));
