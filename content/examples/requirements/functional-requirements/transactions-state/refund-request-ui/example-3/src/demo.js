function detectRefundEdgeCases(refunds) {
  const duplicateRefunds = refunds.filter((refund) => refund.sameOrderRequests > 1).map((refund) => refund.id);
  const lateRefunds = refunds.filter((refund) => refund.daysSincePurchase > refund.maxDays).map((refund) => refund.id);
  return {
    duplicateRefunds,
    lateRefunds,
    blockAutoApproval: duplicateRefunds.length > 0,
    requirePolicyOverride: lateRefunds.length > 0
  };
}

console.log(detectRefundEdgeCases([
  { id: "rf-1", sameOrderRequests: 2, daysSincePurchase: 3, maxDays: 30 },
  { id: "rf-2", sameOrderRequests: 1, daysSincePurchase: 40, maxDays: 30 }
]));
