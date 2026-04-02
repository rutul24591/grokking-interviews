function detectConfirmationScreenEdgeCases(records) {
  const analysis = records.map((record) => ({
    id: record.id,
    stalePending: record.paymentStatus === "pending-settlement" && record.ageMinutes > record.maxPendingMinutes,
    delayedWebhook: !record.webhookReceived && record.paymentStatus !== "failed",
    staleFulfillment: record.fulfillmentStatus === "scheduled" && record.fulfillmentAgeMinutes > record.maxFulfillmentAgeMinutes,
    action:
      record.paymentStatus === "pending-settlement" && record.ageMinutes > record.maxPendingMinutes ? "show-support-path" :
      !record.webhookReceived && record.paymentStatus !== "failed" ? "suppress-success-copy" :
      record.fulfillmentStatus === "scheduled" && record.fulfillmentAgeMinutes > record.maxFulfillmentAgeMinutes ? "refresh-fulfillment" : "none"
  }));

  return {
    analysis,
    showSupportPath: analysis.some((entry) => entry.stalePending),
    refreshFulfillment: analysis.some((entry) => entry.staleFulfillment)
  };
}

console.log(JSON.stringify(detectConfirmationScreenEdgeCases([
  { id: "cf-1", paymentStatus: "pending-settlement", ageMinutes: 40, maxPendingMinutes: 15, webhookReceived: false, fulfillmentStatus: "waiting-webhook", fulfillmentAgeMinutes: 0, maxFulfillmentAgeMinutes: 30 },
  { id: "cf-2", paymentStatus: "captured", ageMinutes: 3, maxPendingMinutes: 15, webhookReceived: true, fulfillmentStatus: "scheduled", fulfillmentAgeMinutes: 60, maxFulfillmentAgeMinutes: 20 },
  { id: "cf-3", paymentStatus: "captured", ageMinutes: 3, maxPendingMinutes: 15, webhookReceived: false, fulfillmentStatus: "scheduled", fulfillmentAgeMinutes: 10, maxFulfillmentAgeMinutes: 20 }
]), null, 2));
