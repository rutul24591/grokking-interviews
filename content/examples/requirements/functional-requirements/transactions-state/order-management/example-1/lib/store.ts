type OrderStage = "created" | "payment-cleared" | "packing" | "shipped" | "blocked";

const state = {
  orders: [
    { id: "ord-201", customer: "Team Alpha", stage: "created" as OrderStage, blocker: "none" },
    { id: "ord-202", customer: "Team Beta", stage: "packing" as OrderStage, blocker: "address-check" },
    { id: "ord-203", customer: "Team Gamma", stage: "shipped" as OrderStage, blocker: "none" }
  ],
  lastMessage: "Order management should make lifecycle stage changes and operational blockers visible before fulfillment is advanced."
};

export function snapshot() {
  return structuredClone({
    orders: state.orders,
    summary: {
      blocked: state.orders.filter((order) => order.blocker !== "none").length,
      readyToShip: state.orders.filter((order) => order.stage === "packing" && order.blocker === "none").length
    },
    lastMessage: state.lastMessage
  });
}

export function mutate(type: "advance-order" | "clear-blocker", value?: string) {
  state.orders = state.orders.map((order) => {
    if (order.id !== value) return order;
    if (type === "clear-blocker") {
      return { ...order, blocker: "none" };
    }
    if (order.blocker !== "none") {
      return { ...order, stage: "blocked" };
    }
    const nextStage =
      order.stage === "created" ? "payment-cleared" :
      order.stage === "payment-cleared" ? "packing" :
      order.stage === "packing" ? "shipped" :
      order.stage;
    return { ...order, stage: nextStage };
  });
  state.lastMessage = `${type} processed for ${value}.`;
  return snapshot();
}
