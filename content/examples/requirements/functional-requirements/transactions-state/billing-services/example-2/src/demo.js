function planBillingCycleJobs(accounts) {
  const jobs = accounts.map((account) => ({
    id: account.id,
    createInvoice: account.subscriptionActive,
    retryWindow: account.failedCharge ? "4h-backoff" : "none",
    blockAutoCharge: account.paymentMethodExpired || account.onManualTerms,
    requireLedgerPost: account.subscriptionActive && !account.failedCharge,
    reasons: [
      account.failedCharge ? "retry-charge" : "bill-normal",
      account.paymentMethodExpired ? "expired-method" : null,
      account.onManualTerms ? "manual-terms" : null
    ].filter(Boolean)
  }));

  return {
    jobs,
    summary: {
      blocked: jobs.filter((job) => job.blockAutoCharge).length,
      ledgerPosts: jobs.filter((job) => job.requireLedgerPost).length
    }
  };
}

console.log(JSON.stringify(planBillingCycleJobs([
  { id: "acct-1", subscriptionActive: true, failedCharge: false, paymentMethodExpired: false, onManualTerms: false },
  { id: "acct-2", subscriptionActive: true, failedCharge: true, paymentMethodExpired: true, onManualTerms: false },
  { id: "acct-3", subscriptionActive: true, failedCharge: false, paymentMethodExpired: false, onManualTerms: true }
]), null, 2));
