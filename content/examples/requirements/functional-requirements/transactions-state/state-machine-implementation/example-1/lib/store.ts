type TxState = "created" | "authorized" | "captured" | "refunded";

const allowedTransitions: Record<TxState, TxState[]> = {
  created: ["authorized"],
  authorized: ["captured"],
  captured: ["refunded"],
  refunded: []
};

const state = {
  current: "created" as TxState,
  lastMessage: "Transaction state machines should make valid transitions explicit and block impossible ones before side effects happen."
};

export function snapshot() {
  return structuredClone({
    current: state.current,
    nextStates: allowedTransitions[state.current],
    lastMessage: state.lastMessage
  });
}

export function mutate(type: "transition", value?: string) {
  const next = value as TxState | undefined;
  if (next && allowedTransitions[state.current].includes(next)) {
    state.current = next;
    state.lastMessage = `Transitioned transaction to ${next}.`;
  } else {
    state.lastMessage = `Rejected invalid transition from ${state.current} to ${value}.`;
  }
  return snapshot();
}
