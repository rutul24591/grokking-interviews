type Window = "day" | "week";

const state = {
  window: "day" as Window,
  entries: {
    day: [
      { id: "log-1", kind: "charge", amount: "$120", ledgerState: "posted" },
      { id: "log-2", kind: "refund", amount: "$45", ledgerState: "pending-reconcile" }
    ],
    week: [
      { id: "log-3", kind: "charge", amount: "$2,100", ledgerState: "posted" },
      { id: "log-4", kind: "adjustment", amount: "$300", ledgerState: "reconciling" }
    ]
  },
  lastMessage: "Financial logs should stay immutable while still exposing reconciliation health and ledger window selection."
};

export function snapshot() {
  const entries = state.entries[state.window];
  return structuredClone({
    window: state.window,
    entries,
    summary: {
      reconciling: entries.filter((entry) => entry.ledgerState !== "posted").length
    },
    lastMessage: state.lastMessage
  });
}

export function mutate(type: "switch-window") {
  if (type === "switch-window") {
    state.window = state.window === "day" ? "week" : "day";
    state.lastMessage = `Loaded ${state.window} financial log window.`;
  }
  return snapshot();
}
