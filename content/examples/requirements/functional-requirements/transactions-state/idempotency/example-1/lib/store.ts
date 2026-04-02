const state = {
  requests: [
    { id: "req-1", key: "pay-ord-100", result: "captured", duplicate: false },
    { id: "req-2", key: "pay-ord-101", result: "processing", duplicate: false }
  ],
  lastMessage: "Idempotent transaction writes should make seen keys and duplicate suppression explicit."
};

export function snapshot() {
  return structuredClone({
    requests: state.requests,
    summary: {
      duplicates: state.requests.filter((request) => request.duplicate).length
    },
    lastMessage: state.lastMessage
  });
}

export function mutate(type: "submit" | "replay", value?: string) {
  if (type === "submit" && value) {
    state.requests.push({
      id: `req-${state.requests.length + 1}`,
      key: value,
      result: "captured",
      duplicate: false
    });
    state.lastMessage = `Processed request ${value}.`;
    return snapshot();
  }

  if (type === "replay" && value) {
    state.requests.push({
      id: `req-${state.requests.length + 1}`,
      key: value,
      result: "deduped-response",
      duplicate: true
    });
    state.lastMessage = `Returned stored response for replayed key ${value}.`;
  }
  return snapshot();
}
