type RefundStatus = "draft" | "submitted" | "review" | "approved" | "rejected";

const state = {
  refunds: [
    { id: "rf-1", orderId: "ord-401", reason: "Duplicate purchase", status: "submitted" as RefundStatus, eligible: true },
    { id: "rf-2", orderId: "ord-402", reason: "Service outage", status: "review" as RefundStatus, eligible: true }
  ],
  draftReason: "Duplicate purchase",
  lastMessage: "Refund-request UIs should expose eligibility, queue position, and current review stage before the user contacts support."
};

export function snapshot() {
  return structuredClone({
    refunds: state.refunds,
    draftReason: state.draftReason,
    summary: {
      pending: state.refunds.filter((refund) => refund.status === "submitted" || refund.status === "review").length
    },
    lastMessage: state.lastMessage
  });
}

export function mutate(type: "submit-refund" | "advance-refund", value?: string) {
  if (type === "submit-refund") {
    state.refunds.unshift({
      id: `rf-${state.refunds.length + 1}`,
      orderId: `ord-40${state.refunds.length + 1}`,
      reason: state.draftReason,
      status: "submitted",
      eligible: true
    });
    state.lastMessage = "Submitted refund request into the review queue.";
    return snapshot();
  }

  if (type === "advance-refund" && value) {
    state.refunds = state.refunds.map((refund) => {
      if (refund.id !== value) return refund;
      const status =
        refund.status === "submitted" ? "review" :
        refund.status === "review" ? "approved" :
        refund.status;
      return { ...refund, status };
    });
    state.lastMessage = `Advanced refund request ${value}.`;
  }
  return snapshot();
}
