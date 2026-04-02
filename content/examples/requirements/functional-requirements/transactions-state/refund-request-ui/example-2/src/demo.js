function chooseRefundPath(refunds) {
  return refunds.map((refund) => ({
    id: refund.id,
    autoApprove: refund.withinWindow && refund.lowAmount,
    sendToReview: refund.highAmount || refund.policyException,
    rejectImmediately: !refund.eligible
  }));
}

console.log(chooseRefundPath([
  { id: "rf-1", withinWindow: true, lowAmount: true, highAmount: false, policyException: false, eligible: true },
  { id: "rf-2", withinWindow: false, lowAmount: false, highAmount: true, policyException: false, eligible: true }
]));
