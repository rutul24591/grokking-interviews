type Stage = "created" | "authorized" | "captured" | "failed";

const state = {
  payment: {
    id: "txn-555",
    stage: "created" as Stage,
    amount: "$249",
    exception: "none"
  },
  lastMessage: "Payment processing should make authorization, capture, and exception state explicit across the transaction lifecycle."
};

export function snapshot() {
  return structuredClone(state);
}

export function mutate(type: "authorize" | "capture" | "fail") {
  if (type === "authorize") {
    state.payment = { ...state.payment, stage: "authorized", exception: "none" };
  } else if (type === "capture") {
    state.payment = { ...state.payment, stage: "captured", exception: "none" };
  } else {
    state.payment = { ...state.payment, stage: "failed", exception: "issuer-decline" };
  }
  state.lastMessage = `Updated payment to ${state.payment.stage}.`;
  return snapshot();
}
