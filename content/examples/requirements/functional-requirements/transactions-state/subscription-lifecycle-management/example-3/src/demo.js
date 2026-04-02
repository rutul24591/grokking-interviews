function detectLifecycleEdgeCases(subscriptions) {
  const analysis = subscriptions.map((subscription) => ({
    id: subscription.id,
    skippedLifecycle: subscription.transitionJump > 1,
    doubleCancel: subscription.cancelRequests > 1,
    pausedWithAccessMismatch: subscription.state === "paused" && subscription.accessStillEnabled,
    action:
      subscription.transitionJump > 1 ? "reject-transition" :
      subscription.cancelRequests > 1 ? "suppress-duplicate-cancel" :
      subscription.state === "paused" && subscription.accessStillEnabled ? "reconcile-access" : "continue"
  }));

  return {
    analysis,
    rejectTransition: analysis.some((entry) => entry.skippedLifecycle),
    reconcileAccess: analysis.some((entry) => entry.pausedWithAccessMismatch)
  };
}

console.log(JSON.stringify(detectLifecycleEdgeCases([
  { id: "sub-1", transitionJump: 2, cancelRequests: 0, state: "active", accessStillEnabled: true },
  { id: "sub-2", transitionJump: 0, cancelRequests: 2, state: "active", accessStillEnabled: true },
  { id: "sub-3", transitionJump: 0, cancelRequests: 0, state: "paused", accessStillEnabled: true }
]), null, 2));
