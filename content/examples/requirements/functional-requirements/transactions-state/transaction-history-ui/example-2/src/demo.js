function chooseTransactionHistorySurface(records) {
  const surfaces = records.map((record) => ({
    id: record.id,
    surface: record.status === "failed" ? "failed-transactions" : record.status === "refunded" ? "refund-history" : "all-history",
    showTimeline: true,
    showRetryLink: record.status === "failed",
    secondaryCTA: record.status === "refunded" ? "download-credit-note" : record.status === "failed" ? "retry-payment" : "view-receipt"
  }));

  return {
    surfaces,
    summary: {
      retryLinks: surfaces.filter((entry) => entry.showRetryLink).length,
      refunds: surfaces.filter((entry) => entry.surface === "refund-history").length
    }
  };
}

console.log(JSON.stringify(chooseTransactionHistorySurface([
  { id: "txn-1", status: "failed" },
  { id: "txn-2", status: "captured" },
  { id: "txn-3", status: "refunded" }
]), null, 2));
