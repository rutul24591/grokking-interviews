const state = {
  mode: "balanced" as "strict" | "balanced" | "lenient",
  cases: [
    { id: "fd-1", signal: "like-burst from shared ASN", entity: "post-118", strict: "block" as const, balanced: "review" as const, lenient: "monitor" as const },
    { id: "fd-2", signal: "reaction ring overlap", entity: "post-220", strict: "review" as const, balanced: "review" as const, lenient: "monitor" as const }
  ],
  lastMessage: "Fraud detection surfaces should show why engagement is suspicious before the system suppresses visible counters."
};

export function snapshot() {
  return structuredClone({
    mode: state.mode,
    cases: state.cases.map((item) => ({ id: item.id, signal: item.signal, entity: item.entity, decision: item[state.mode] })),
    lastMessage: state.lastMessage
  });
}

export function mutate(mode: "strict" | "balanced" | "lenient") {
  state.mode = mode;
  state.lastMessage = `Switched fraud heuristics to ${mode}.`;
  return snapshot();
}
