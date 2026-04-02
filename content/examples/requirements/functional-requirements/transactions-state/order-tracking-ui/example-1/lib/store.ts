type Milestone = "label-created" | "in-transit" | "out-for-delivery" | "delivered" | "exception";

const state = {
  shipment: {
    trackingId: "trk-888",
    milestone: "in-transit" as Milestone,
    eta: "Tomorrow 6 PM",
    exception: "none"
  },
  lastMessage: "Order tracking UIs should keep milestone progression, ETA, and delivery exceptions visible on one screen."
};

export function snapshot() {
  return structuredClone(state);
}

export function mutate(type: "advance-shipment") {
  if (type === "advance-shipment") {
    state.shipment =
      state.shipment.milestone === "in-transit"
        ? { ...state.shipment, milestone: "out-for-delivery", eta: "Today 8 PM", exception: "none" }
        : state.shipment.milestone === "out-for-delivery"
          ? { ...state.shipment, milestone: "delivered", eta: "Delivered", exception: "none" }
          : { ...state.shipment, milestone: "exception", eta: "Delayed", exception: "carrier-delay" };
    state.lastMessage = `Updated shipment to ${state.shipment.milestone}.`;
  }
  return snapshot();
}
