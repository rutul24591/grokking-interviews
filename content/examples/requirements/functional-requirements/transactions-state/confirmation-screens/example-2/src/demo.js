function chooseConfirmationMessaging(cases) {
  const messages = cases.map((entry) => ({
    id: entry.id,
    headline:
      entry.paymentStatus === "captured" ? "Order confirmed" :
      entry.paymentStatus === "pending-settlement" ? "Payment pending" :
      "Payment failed",
    showFulfillmentETA: entry.fulfillmentStatus === "scheduled",
    showRetryAction: entry.paymentStatus === "failed",
    supportPath:
      entry.paymentStatus === "failed" ? "retry-payment" :
      entry.fulfillmentStatus === "waiting-webhook" ? "track-status" : "receipt"
  }));

  return {
    messages,
    summary: {
      retries: messages.filter((entry) => entry.showRetryAction).length,
      scheduled: messages.filter((entry) => entry.showFulfillmentETA).length
    }
  };
}

console.log(JSON.stringify(chooseConfirmationMessaging([
  { id: "cf-1", paymentStatus: "captured", fulfillmentStatus: "scheduled" },
  { id: "cf-2", paymentStatus: "failed", fulfillmentStatus: "not-started" },
  { id: "cf-3", paymentStatus: "pending-settlement", fulfillmentStatus: "waiting-webhook" }
]), null, 2));
