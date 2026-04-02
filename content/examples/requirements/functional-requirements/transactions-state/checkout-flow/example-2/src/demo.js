function evaluateCheckoutReadiness(checkouts) {
  return checkouts.map((checkout) => ({
    id: checkout.id,
    allowNextStep: checkout.formValid && checkout.inventoryReserved,
    createPaymentIntent: checkout.step === "payment" && checkout.formValid,
    blockSubmission: !checkout.paymentMethodPresent || checkout.fraudReviewPending
  }));
}

console.log(evaluateCheckoutReadiness([
  { id: "co-1", step: "details", formValid: true, inventoryReserved: true, paymentMethodPresent: false, fraudReviewPending: false },
  { id: "co-2", step: "payment", formValid: true, inventoryReserved: true, paymentMethodPresent: true, fraudReviewPending: true }
]));
