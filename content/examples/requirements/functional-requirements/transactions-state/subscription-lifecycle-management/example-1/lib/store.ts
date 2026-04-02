type LifecycleState = "trial" | "active" | "paused" | "cancelled";

const state = {
  subscription: {
    id: "sub-life-1",
    state: "trial" as LifecycleState,
    renewalDate: "2026-05-01",
    pauseReason: "none"
  },
  lastMessage: "Subscription lifecycle flows should surface every transition so operators can explain why access changed."
};

export function snapshot() {
  return structuredClone(state);
}

export function mutate(type: "advance-lifecycle") {
  if (type === "advance-lifecycle") {
    state.subscription =
      state.subscription.state === "trial"
        ? { ...state.subscription, state: "active", pauseReason: "none" }
        : state.subscription.state === "active"
          ? { ...state.subscription, state: "paused", pauseReason: "customer-request" }
          : state.subscription.state === "paused"
            ? { ...state.subscription, state: "cancelled", pauseReason: "none" }
            : { ...state.subscription, state: "trial", pauseReason: "none" };
    state.lastMessage = `Moved subscription to ${state.subscription.state}.`;
  }
  return snapshot();
}
