const flagState = {
  flags: [
    { id: "ff-1", name: "new-moderation-model", enabled: true, rolloutPercent: 25, reviewRequired: true },
    { id: "ff-2", name: "queue-priority-view", enabled: false, rolloutPercent: 0, reviewRequired: false }
  ],
  lastMessage: "Feature flag controls should show rollout posture and review requirements before operators flip high-impact features."
};

export function snapshot() {
  return structuredClone(flagState);
}

export function mutate(id: string) {
  flagState.flags = flagState.flags.map((flag) => flag.id === id ? { ...flag, enabled: !flag.enabled } : flag);
  flagState.lastMessage = `Toggled ${id}.`;
  return snapshot();
}
