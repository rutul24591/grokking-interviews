function chooseHistorySurface(orders) {
  return orders.map((order) => ({
    id: order.id,
    surface: order.refundState === "refunded" ? "refund-history" : order.status === "processing" ? "active-orders" : "all-orders",
    showSupportCTA: order.status === "processing" || order.refundState === "pending",
    exposeReceipt: order.status === "fulfilled"
  }));
}

console.log(chooseHistorySurface([
  { id: "ord-100", status: "fulfilled", refundState: "none" },
  { id: "ord-101", status: "processing", refundState: "pending" }
]));
