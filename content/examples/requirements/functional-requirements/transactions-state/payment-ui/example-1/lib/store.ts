type View = "entry" | "processing" | "failed" | "confirmed";

const state = {
  view: "entry" as View,
  paymentMethod: "card",
  ctaEnabled: true,
  helper: "Enter a payment method to continue.",
  lastMessage: "Payment UIs should expose readiness, in-flight state, and failure recovery without confusing the user about what will happen next."
};

export function snapshot() {
  return structuredClone(state);
}

export function mutate(type: "advance-ui") {
  if (type === "advance-ui") {
    state.view =
      state.view === "entry" ? "processing" :
      state.view === "processing" ? "failed" :
      state.view === "failed" ? "confirmed" :
      "entry";
    state.ctaEnabled = state.view !== "processing";
    state.helper =
      state.view === "entry" ? "Enter a payment method to continue." :
      state.view === "processing" ? "Do not refresh while the payment is being processed." :
      state.view === "failed" ? "Update the payment method or retry." :
      "Payment confirmed.";
    state.lastMessage = `Loaded ${state.view} payment UI state.`;
  }
  return snapshot();
}
