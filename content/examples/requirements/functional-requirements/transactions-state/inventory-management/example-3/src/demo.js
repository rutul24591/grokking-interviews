function detectInventoryEdgeCases(items) {
  const oversold = items.filter((item) => item.reserved > item.total).map((item) => item.id);
  const staleReads = items.filter((item) => item.readVersionLag > 0).map((item) => item.id);
  return {
    oversold,
    staleReads,
    freezeReservations: oversold.length > 0,
    refreshInventoryProjection: staleReads.length > 0
  };
}

console.log(detectInventoryEdgeCases([
  { id: "sku-1", reserved: 8, total: 7, readVersionLag: 0 },
  { id: "sku-2", reserved: 1, total: 6, readVersionLag: 2 }
]));
