type Filter = "all" | "failed" | "refunded";

const state = {
  filter: "all" as Filter,
  transactions: [
    { id: "txn-701", amount: "$199", status: "captured", timeline: "charged → settled" },
    { id: "txn-702", amount: "$49", status: "failed", timeline: "authorized → failed" },
    { id: "txn-703", amount: "$89", status: "refunded", timeline: "captured → refunded" }
  ],
  lastMessage: "Transaction history UIs should expose the record set and the outcome timeline needed for finance and support follow-up."
};

export function snapshot() {
  const transactions = state.filter === "all"
    ? state.transactions
    : state.transactions.filter((transaction) => transaction.status === state.filter);
  return structuredClone({
    filter: state.filter,
    transactions,
    summary: { visible: transactions.length },
    lastMessage: state.lastMessage
  });
}

export function mutate(type: "switch-filter", value?: string) {
  if (type === "switch-filter" && value) {
    state.filter = value as Filter;
    state.lastMessage = `Loaded ${state.filter} transaction history view.`;
  }
  return snapshot();
}
