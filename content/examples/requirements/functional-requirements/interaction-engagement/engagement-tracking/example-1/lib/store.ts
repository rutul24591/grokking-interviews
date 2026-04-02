const state = {
  mode: "immediate" as "immediate" | "batched",
  events: [
    { id: "et-1", event: "view", entity: "post-118", status: "sent" as const },
    { id: "et-2", event: "share", entity: "post-220", status: "queued" as const }
  ],
  lastMessage: "Engagement tracking should make delivery semantics visible so product teams understand whether counters are sourced from live or delayed events."
};

export function snapshot() {
  return structuredClone(state);
}

export function mutate(type: "switch-mode" | "emit-event", value?: string) {
  if (type === "switch-mode" && value) {
    state.mode = value as "immediate" | "batched";
    state.lastMessage = `Switched engagement tracking to ${state.mode}.`;
    return snapshot();
  }
  if (type === "emit-event" && value) {
    state.events.unshift({
      id: `et-${state.events.length + 1}`,
      event: value,
      entity: "post-118",
      status: state.mode === "immediate" ? "sent" as const : "queued" as const
    });
    state.lastMessage = `Emitted ${value} event using ${state.mode} delivery.`;
  }
  return snapshot();
}
