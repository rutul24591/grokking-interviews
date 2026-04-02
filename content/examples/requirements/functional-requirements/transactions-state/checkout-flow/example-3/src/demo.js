function detectCheckoutEdgeCases(orders) {
  const duplicateSubmissions = orders.filter((order) => order.sameIdempotencyKeySeen).map((order) => order.id);
  const inventoryChanged = orders.filter((order) => order.inventoryVersionMismatch).map((order) => order.id);
  return {
    duplicateSubmissions,
    inventoryChanged,
    suppressSecondCharge: duplicateSubmissions.length > 0,
    returnToReview: inventoryChanged.length > 0
  };
}

console.log(detectCheckoutEdgeCases([
  { id: "co-1", sameIdempotencyKeySeen: true, inventoryVersionMismatch: false },
  { id: "co-2", sameIdempotencyKeySeen: false, inventoryVersionMismatch: true }
]));
