type Filter = "all" | "active" | "refunded";

const state = {
  filter: "all" as Filter,
  orders: [
    { id: "ord-100", total: "$199", status: "fulfilled", refundState: "none" },
    { id: "ord-101", total: "$89", status: "processing", refundState: "none" },
    { id: "ord-102", total: "$49", status: "closed", refundState: "refunded" }
  ],
  lastMessage: "Order history UIs should let users find fulfillment, refund, and active transaction state without reopening support tickets."
};

export function snapshot() {
  const orders = state.filter === "all"
    ? state.orders
    : state.filter === "active"
      ? state.orders.filter((order) => order.status === "processing")
      : state.orders.filter((order) => order.refundState === "refunded");
  return structuredClone({
    filter: state.filter,
    orders,
    summary: { visible: orders.length },
    lastMessage: state.lastMessage
  });
}

export function mutate(type: "switch-filter", value?: string) {
  if (type === "switch-filter" && value) {
    state.filter = value as Filter;
    state.lastMessage = `Loaded ${state.filter} order history view.`;
  }
  return snapshot();
}
