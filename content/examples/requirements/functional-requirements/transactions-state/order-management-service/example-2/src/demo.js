function chooseOrderLane(orders) {
  return orders.map((order) => ({
    id: order.id,
    lane: !order.paymentCleared ? "payment-review" : order.inventoryAllocated ? "fulfillment" : "inventory-hold",
    notifyOps: order.blockerPresent,
    stopAdvance: order.manualReview
  }));
}

console.log(chooseOrderLane([
  { id: "ord-201", paymentCleared: false, inventoryAllocated: false, blockerPresent: true, manualReview: false },
  { id: "ord-202", paymentCleared: true, inventoryAllocated: true, blockerPresent: false, manualReview: true }
]));
