const queueState = {
  activeQueue: "spam",
  items: [
    { id: "mq-11", subject: "Bot link farm", queue: "spam" as const, status: "new" as const },
    { id: "mq-17", subject: "Self-harm escalation", queue: "safety" as const, status: "claimed" as const }
  ],
  lastMessage: "Queue UIs should make backlog ownership explicit so urgent items do not stall behind lower-risk work."
};

export function snapshot() {
  return structuredClone(queueState);
}

export function mutate(type: "switch-queue" | "claim-item", id?: string) {
  if (type === "switch-queue") {
    queueState.activeQueue = queueState.activeQueue === "spam" ? "safety" : "spam";
    queueState.lastMessage = `Switched supervisor view to ${queueState.activeQueue}.`;
    return snapshot();
  }
  if (type === "claim-item" && id) {
    queueState.items = queueState.items.map((item) => item.id === id ? { ...item, status: "claimed" as const } : item);
    queueState.lastMessage = `Claimed ${id} for active moderation review.`;
  }
  return snapshot();
}
