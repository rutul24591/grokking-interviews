const state = {
  mode: "all" as "all" | "authors" | "newsletters",
  targets: [
    { id: "fs-1", name: "Anika Sharma", type: "author" as const, following: true },
    { id: "fs-2", name: "Backend Weekly", type: "newsletter" as const, following: false },
    { id: "fs-3", name: "Rohan Iyer", type: "author" as const, following: false }
  ],
  lastMessage: "Follow and subscribe surfaces should make relationship state obvious so users can manage long-term engagement without friction."
};

export function snapshot() {
  const targets = state.mode === "all" ? state.targets : state.targets.filter((target) => target.type === state.mode.slice(0, -1));
  return structuredClone({ mode: state.mode, targets, lastMessage: state.lastMessage });
}

export function mutate(type: "switch-mode" | "toggle-follow", value?: string) {
  if (type === "switch-mode" && value) {
    state.mode = value as "all" | "authors" | "newsletters";
    state.lastMessage = `Viewing ${state.mode} follow targets.`;
    return snapshot();
  }
  if (type === "toggle-follow" && value) {
    state.targets = state.targets.map((target) => target.id === value ? { ...target, following: !target.following } : target);
    state.lastMessage = `Updated follow state for ${value}.`;
  }
  return snapshot();
}
