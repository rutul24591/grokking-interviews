function chooseSubscriptionControls(subscriptions) {
  const controls = subscriptions.map((subscription) => ({
    id: subscription.id,
    showResume: subscription.view === "paused",
    showCancelAtPeriodEnd: subscription.view === "active",
    showWarning: subscription.paymentIssue || subscription.view === "cancel-pending",
    primaryAction: subscription.view === "paused" ? "resume" : subscription.view === "active" ? "pause-or-cancel" : "review-cancellation"
  }));

  return {
    controls,
    summary: {
      warnings: controls.filter((entry) => entry.showWarning).length,
      resumeVisible: controls.filter((entry) => entry.showResume).length
    }
  };
}

console.log(JSON.stringify(chooseSubscriptionControls([
  { id: "sub-ui-1", view: "paused", paymentIssue: false },
  { id: "sub-ui-2", view: "active", paymentIssue: true },
  { id: "sub-ui-3", view: "cancel-pending", paymentIssue: false }
]), null, 2));
