type Step = "cart" | "details" | "payment" | "review";

const state = {
  step: "cart" as Step,
  paymentIntent: "not-created",
  inventoryState: "reserved",
  orderReady: false,
  items: [
    { id: "item-1", label: "Interview prep annual", price: "$199" },
    { id: "item-2", label: "Architecture workshop", price: "$49" }
  ],
  lastMessage: "Checkout flows should expose step readiness, payment-intent state, and inventory validity before submission."
};

export function snapshot() {
  return structuredClone(state);
}

export function mutate(type: "next-step" | "create-payment-intent" | "submit-order") {
  if (type === "next-step") {
    state.step = state.step === "cart" ? "details" : state.step === "details" ? "payment" : state.step === "payment" ? "review" : "review";
    state.orderReady = state.step === "review" && state.paymentIntent === "created" && state.inventoryState === "reserved";
    state.lastMessage = `Advanced checkout to ${state.step}.`;
    return snapshot();
  }

  if (type === "create-payment-intent") {
    state.paymentIntent = "created";
    state.lastMessage = "Created payment intent for checkout.";
    state.orderReady = state.step === "review" && state.inventoryState === "reserved";
    return snapshot();
  }

  state.lastMessage = state.orderReady ? "Submitted order successfully." : "Order submission blocked until review step, payment intent, and inventory hold are ready.";
  return snapshot();
}
