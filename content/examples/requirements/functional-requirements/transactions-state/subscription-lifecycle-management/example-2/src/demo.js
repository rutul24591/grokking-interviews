function chooseLifecycleAction(subscriptions) {
  const actions = subscriptions.map((subscription) => ({
    id: subscription.id,
    activate: subscription.state === "trial" && subscription.paymentReady,
    pause: subscription.state === "active" && subscription.pauseRequested,
    cancel: subscription.state !== "cancelled" && subscription.cancelRequested,
    nextLane:
      subscription.state === "trial" && subscription.paymentReady ? "activate" :
      subscription.state === "active" && subscription.pauseRequested ? "pause" :
      subscription.cancelRequested ? "cancel" : "hold"
  }));

  return {
    actions,
    summary: {
      activations: actions.filter((entry) => entry.activate).length,
      cancellations: actions.filter((entry) => entry.cancel).length
    }
  };
}

console.log(JSON.stringify(chooseLifecycleAction([
  { id: "sub-1", state: "trial", paymentReady: true, pauseRequested: false, cancelRequested: false },
  { id: "sub-2", state: "active", paymentReady: true, pauseRequested: true, cancelRequested: false },
  { id: "sub-3", state: "paused", paymentReady: true, pauseRequested: false, cancelRequested: true }
]), null, 2));
