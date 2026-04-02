type View = "active" | "paused" | "cancel-pending";

const state = {
  subscription: {
    id: "sub-ui-1",
    plan: "Principal Interview Prep",
    view: "active" as View,
    nextBillDate: "2026-05-01",
    actionHint: "You can pause or cancel before the next bill date."
  },
  lastMessage: "Subscription management UIs should expose plan state, next billing date, and the consequence of each action before the user commits."
};

export function snapshot() {
  return structuredClone(state);
}

export function mutate(type: "switch-view") {
  if (type === "switch-view") {
    state.subscription =
      state.subscription.view === "active"
        ? { ...state.subscription, view: "paused", actionHint: "Resume to restore access before renewal." }
        : state.subscription.view === "paused"
          ? { ...state.subscription, view: "cancel-pending", actionHint: "Cancellation will take effect at period end." }
          : { ...state.subscription, view: "active", actionHint: "You can pause or cancel before the next bill date." };
    state.lastMessage = `Loaded ${state.subscription.view} subscription-management view.`;
  }
  return snapshot();
}
