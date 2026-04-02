function detectBillingPlatformEdgeCases(invoices) {
  const analysis = invoices.map((invoice) => ({
    id: invoice.id,
    duplicateInvoice: invoice.sameCycleCount > 1,
    settlementFailure: ["timeout", "failed"].includes(invoice.gatewayStatus),
    manualReconcile: invoice.gatewayStatus !== "captured" || invoice.sameCycleCount > 1,
    severity:
      invoice.sameCycleCount > 1 ? "critical" :
      invoice.gatewayStatus === "timeout" ? "high" :
      invoice.gatewayStatus === "failed" ? "medium" : "low"
  }));

  return {
    analysis,
    freezeAutoRetry: analysis.some((entry) => entry.duplicateInvoice),
    requireOperatorReconcile: analysis.some((entry) => entry.manualReconcile)
  };
}

console.log(JSON.stringify(detectBillingPlatformEdgeCases([
  { id: "inv-1", sameCycleCount: 2, gatewayStatus: "failed" },
  { id: "inv-2", sameCycleCount: 1, gatewayStatus: "captured" },
  { id: "inv-3", sameCycleCount: 1, gatewayStatus: "timeout" }
]), null, 2));
