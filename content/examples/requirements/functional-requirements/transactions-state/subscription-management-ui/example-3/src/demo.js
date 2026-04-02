function detectSubscriptionUIEdgeCases(subscriptions) {
  const analysis = subscriptions.map((subscription) => ({
    id: subscription.id,
    staleView: subscription.viewVersionLag > 0,
    conflictingActions: subscription.pauseRequested && subscription.cancelRequested,
    outdatedBillDate: subscription.nextBillDateVersionLag > 0,
    action:
      subscription.viewVersionLag > 0 ? "refetch-before-submit" :
      subscription.pauseRequested && subscription.cancelRequested ? "require-single-action-choice" :
      subscription.nextBillDateVersionLag > 0 ? "refresh-billing-copy" : "continue"
  }));

  return {
    analysis,
    refetchBeforeSubmit: analysis.some((entry) => entry.staleView),
    refreshBillingCopy: analysis.some((entry) => entry.outdatedBillDate)
  };
}

console.log(JSON.stringify(detectSubscriptionUIEdgeCases([
  { id: "sub-ui-1", viewVersionLag: 2, pauseRequested: false, cancelRequested: false, nextBillDateVersionLag: 0 },
  { id: "sub-ui-2", viewVersionLag: 0, pauseRequested: true, cancelRequested: true, nextBillDateVersionLag: 0 },
  { id: "sub-ui-3", viewVersionLag: 0, pauseRequested: false, cancelRequested: false, nextBillDateVersionLag: 1 }
]), null, 2));
