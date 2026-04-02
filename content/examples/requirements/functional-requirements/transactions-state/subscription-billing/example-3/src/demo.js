function detectSubscriptionBillingEdgeCases(subscriptions) {
  const duplicateRenewals = subscriptions.filter((subscription) => subscription.sameCycleCharges > 1).map((subscription) => subscription.id);
  const stalePricing = subscriptions.filter((subscription) => subscription.planVersionLag > 0).map((subscription) => subscription.id);
  return {
    duplicateRenewals,
    stalePricing,
    blockChargeRun: duplicateRenewals.length > 0,
    refreshPricingModel: stalePricing.length > 0
  };
}

console.log(detectSubscriptionBillingEdgeCases([
  { id: "sub-1", sameCycleCharges: 2, planVersionLag: 0 },
  { id: "sub-2", sameCycleCharges: 1, planVersionLag: 1 }
]));
