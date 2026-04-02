type Strategy = "stripe-primary" | "adyen-primary" | "hybrid";

const state = {
  strategy: "hybrid" as Strategy,
  accounts: [
    {
      id: "acct-1",
      customer: "Enterprise A",
      provider: "Stripe",
      invoiceStatus: "paid",
      dunningStage: "none",
      retryEligible: false
    },
    {
      id: "acct-2",
      customer: "Enterprise B",
      provider: "Adyen",
      invoiceStatus: "failed",
      dunningStage: "retry-2",
      retryEligible: true
    },
    {
      id: "acct-3",
      customer: "Startup C",
      provider: "Hybrid failover",
      invoiceStatus: "pending",
      dunningStage: "retry-1",
      retryEligible: true
    }
  ],
  lastMessage: "Billing platforms should expose provider routing, invoice outcome, and dunning visibility in one operational view."
};

function providerFor(strategy: Strategy, current: string) {
  if (strategy === "stripe-primary") return "Stripe";
  if (strategy === "adyen-primary") return "Adyen";
  return current === "Stripe" ? "Stripe + Adyen backup" : current === "Adyen" ? "Adyen + Stripe backup" : current;
}

export function snapshot() {
  return structuredClone({
    strategy: state.strategy,
    summary: {
      retryEligible: state.accounts.filter((account) => account.retryEligible).length,
      failed: state.accounts.filter((account) => account.invoiceStatus === "failed").length
    },
    accounts: state.accounts,
    lastMessage: state.lastMessage
  });
}

export function mutate(type: "switch-strategy" | "retry-invoice", value?: string) {
  if (type === "switch-strategy" && value) {
    state.strategy = value as Strategy;
    state.accounts = state.accounts.map((account) => ({
      ...account,
      provider: providerFor(state.strategy, account.provider)
    }));
    state.lastMessage = `Switched billing platform routing to ${state.strategy}.`;
    return snapshot();
  }

  if (type === "retry-invoice" && value) {
    state.accounts = state.accounts.map((account) =>
      account.id === value
        ? {
            ...account,
            invoiceStatus: "pending",
            dunningStage: "retry-queued",
            retryEligible: false
          }
        : account
    );
    state.lastMessage = `Queued invoice retry for ${value}.`;
  }

  return snapshot();
}
