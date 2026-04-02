type Decision = "allow" | "review" | "block";

const state = {
  cases: [
    { id: "fraud-1", orderId: "ord-501", score: 28, decision: "allow" as Decision, signal: "trusted-device" },
    { id: "fraud-2", orderId: "ord-502", score: 86, decision: "review" as Decision, signal: "velocity-spike" },
    { id: "fraud-3", orderId: "ord-503", score: 97, decision: "block" as Decision, signal: "stolen-card-pattern" }
  ],
  lastMessage: "Transaction fraud controls should expose risk score, decision, and the signal that drove the outcome."
};

export function snapshot() {
  return structuredClone({
    cases: state.cases,
    summary: {
      blocked: state.cases.filter((entry) => entry.decision === "block").length,
      review: state.cases.filter((entry) => entry.decision === "review").length
    },
    lastMessage: state.lastMessage
  });
}

export function mutate(type: "escalate-review" | "clear-case", value?: string) {
  state.cases = state.cases.map((entry) => {
    if (entry.id !== value) return entry;
    if (type === "escalate-review") {
      return { ...entry, decision: "review", score: Math.max(entry.score, 80) };
    }
    return { ...entry, decision: "allow", score: Math.min(entry.score, 30), signal: "manual-clear" };
  });
  state.lastMessage = `${type} processed for ${value}.`;
  return snapshot();
}
