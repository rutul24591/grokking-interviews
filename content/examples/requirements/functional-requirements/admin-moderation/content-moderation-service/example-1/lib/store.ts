const moderationServiceState = {
  queueDepth: 9,
  items: [
    { id: "ms-1", contentId: "post-118", decision: "review" as const, reason: "hate-speech-likelihood" },
    { id: "ms-2", contentId: "post-220", decision: "allow" as const, reason: "low-risk-signal" }
  ],
  lastMessage: "Moderation services should explain current decisions and make escalation visible to operators."
};

export function snapshot() {
  return structuredClone(moderationServiceState);
}

export function mutate(id: string) {
  moderationServiceState.items = moderationServiceState.items.map((item) => item.id === id ? { ...item, decision: "block", reason: "promoted-by-operator" } : item);
  moderationServiceState.lastMessage = `Promoted ${id} into a block decision.`;
  return snapshot();
}
