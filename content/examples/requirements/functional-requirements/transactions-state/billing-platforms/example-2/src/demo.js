function chooseBillingProvider(accounts) {
  const plan = accounts.map((account) => {
    const reasons = [];
    let provider = account.region === "EU" ? "Adyen" : "Stripe";
    if (account.highRetryRisk) {
      provider = "Hybrid failover";
      reasons.push("retry-risk");
    }
    if (account.multiRegionTraffic) reasons.push("multi-region");
    if (account.cardMix === "unknown") reasons.push("manual-review");
    return {
      id: account.id,
      provider,
      enableBackupPath: account.highRetryRisk || account.multiRegionTraffic,
      settlementWindow: account.enterprise ? "same-day" : "next-day",
      createManualReview: account.cardMix === "unknown",
      reasons
    };
  });

  return {
    plan,
    summary: {
      hybridRoutes: plan.filter((entry) => entry.provider === "Hybrid failover").length,
      manualReviews: plan.filter((entry) => entry.createManualReview).length
    }
  };
}

console.log(JSON.stringify(chooseBillingProvider([
  { id: "acct-1", region: "US", highRetryRisk: false, enterprise: true, multiRegionTraffic: false, cardMix: "standard" },
  { id: "acct-2", region: "EU", highRetryRisk: true, enterprise: false, multiRegionTraffic: true, cardMix: "unknown" },
  { id: "acct-3", region: "US", highRetryRisk: false, enterprise: false, multiRegionTraffic: true, cardMix: "mixed" }
]), null, 2));
