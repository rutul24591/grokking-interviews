const state = {
  subscriptions: [
    { id: "sub-1", customer: "Team Alpha", renewalState: "paid", retryEligible: false, nextBillDate: "2026-05-01" },
    { id: "sub-2", customer: "Team Beta", renewalState: "failed", retryEligible: true, nextBillDate: "2026-05-01" }
  ],
  lastMessage: "Subscription billing should expose renewal outcome, retryability, and the next bill date before the customer notices a failure."
};

export function snapshot() {
  return structuredClone({
    subscriptions: state.subscriptions,
    summary: { retryEligible: state.subscriptions.filter((subscription) => subscription.retryEligible).length },
    lastMessage: state.lastMessage
  });
}

export function mutate(type: "bill-subscription" | "retry-subscription", value?: string) {
  state.subscriptions = state.subscriptions.map((subscription) => {
    if (subscription.id !== value) return subscription;
    if (type === "bill-subscription") {
      return { ...subscription, renewalState: "processing" };
    }
    return { ...subscription, renewalState: "paid", retryEligible: false };
  });
  state.lastMessage = `${type} processed for ${value}.`;
  return snapshot();
}
