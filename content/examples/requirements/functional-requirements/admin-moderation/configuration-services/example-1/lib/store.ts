const configState = {
  entries: [
    { id: "cfg-1", key: "moderation.threshold", value: "72", environment: "prod" as const, pendingReview: true, blastRadius: "model-router", owner: "trust-ops" },
    { id: "cfg-2", key: "alert.noise_budget", value: "12", environment: "staging" as const, pendingReview: false, blastRadius: "pager-policy", owner: "site-reliability" }
  ],
  lastMessage: "Configuration services should make review state explicit before high-impact settings reach production."
};

export function snapshot() {
  return structuredClone(configState);
}

export function mutate(id: string) {
  configState.entries = configState.entries.map((entry) => entry.id === id ? { ...entry, pendingReview: false } : entry);
  configState.lastMessage = `Cleared pending review for ${id}.`;
  return snapshot();
}
