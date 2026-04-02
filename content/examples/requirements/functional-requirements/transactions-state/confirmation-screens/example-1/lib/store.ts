type Outcome = "success" | "pending" | "failed";

const state = {
  outcome: "success" as Outcome,
  confirmation: {
    paymentStatus: "captured",
    fulfillmentStatus: "scheduled",
    nextAction: "Download receipt",
    reference: "ORD-2026-0412"
  },
  lastMessage: "Confirmation screens should match payment outcome, fulfillment state, and the user’s next required action."
};

export function snapshot() {
  return structuredClone(state);
}

export function mutate(type: "switch-outcome") {
  if (type === "switch-outcome") {
    state.outcome = state.outcome === "success" ? "pending" : state.outcome === "pending" ? "failed" : "success";
    state.confirmation =
      state.outcome === "success"
        ? { paymentStatus: "captured", fulfillmentStatus: "scheduled", nextAction: "Download receipt", reference: "ORD-2026-0412" }
        : state.outcome === "pending"
          ? { paymentStatus: "pending-settlement", fulfillmentStatus: "waiting-webhook", nextAction: "Return later", reference: "ORD-2026-0412" }
          : { paymentStatus: "failed", fulfillmentStatus: "not-started", nextAction: "Retry payment", reference: "ORD-2026-0412" };
    state.lastMessage = `Loaded ${state.outcome} confirmation state.`;
  }
  return snapshot();
}
