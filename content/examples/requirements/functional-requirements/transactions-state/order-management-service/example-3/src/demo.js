function detectOrderManagementEdgeCases(orders) {
  const partialFulfillment = orders.filter((order) => order.itemsShipped < order.itemsOrdered).map((order) => order.id);
  const staleBlockers = orders.filter((order) => order.blockerAgeHours > order.maxBlockerHours).map((order) => order.id);
  return {
    partialFulfillment,
    staleBlockers,
    splitShipmentFlow: partialFulfillment.length > 0,
    escalateBlocker: staleBlockers.length > 0
  };
}

console.log(detectOrderManagementEdgeCases([
  { id: "ord-201", itemsShipped: 1, itemsOrdered: 3, blockerAgeHours: 2, maxBlockerHours: 12 },
  { id: "ord-202", itemsShipped: 2, itemsOrdered: 2, blockerAgeHours: 18, maxBlockerHours: 12 }
]));
