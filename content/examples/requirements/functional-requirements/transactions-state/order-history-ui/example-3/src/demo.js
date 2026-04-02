function detectOrderHistoryEdgeCases(orders) {
  const staleCache = orders.filter((order) => order.cacheAgeMinutes > order.maxCacheAgeMinutes).map((order) => order.id);
  const missingRefundStatus = orders.filter((order) => order.refundRequested && order.refundState === "unknown").map((order) => order.id);
  return {
    staleCache,
    missingRefundStatus,
    refetchTimeline: staleCache.length > 0,
    showSupportEscalation: missingRefundStatus.length > 0
  };
}

console.log(detectOrderHistoryEdgeCases([
  { id: "ord-100", cacheAgeMinutes: 90, maxCacheAgeMinutes: 30, refundRequested: false, refundState: "none" },
  { id: "ord-101", cacheAgeMinutes: 5, maxCacheAgeMinutes: 30, refundRequested: true, refundState: "unknown" }
]));
