function chooseProcessingStep(payments) {
  return payments.map((payment) => ({
    id: payment.id,
    authorize: payment.stage === "created",
    capture: payment.stage === "authorized" && payment.riskCleared,
    defer: payment.manualReview || payment.inventoryPending
  }));
}

console.log(chooseProcessingStep([
  { id: "txn-1", stage: "created", riskCleared: false, manualReview: false, inventoryPending: false },
  { id: "txn-2", stage: "authorized", riskCleared: true, manualReview: false, inventoryPending: false }
]));
