const state = {
  filter: "all" as "all" | "following" | "saved",
  items: [
    { id: "af-1", actor: "Priya", action: "commented on", target: "Database scaling notes", freshness: "new" as const, segment: "following" as const },
    { id: "af-2", actor: "System Design Digest", action: "published", target: "Sharding checklist", freshness: "warm" as const, segment: "saved" as const },
    { id: "af-3", actor: "Rohan", action: "liked", target: "Caching trade-offs", freshness: "old" as const, segment: "following" as const }
  ],
  lastMessage: "Activity feeds should expose enough context to let users decide whether to open, save, or ignore each item."
};

export function snapshot() {
  const items = state.filter === "all" ? state.items : state.items.filter((item) => item.segment === state.filter);
  return structuredClone({ filter: state.filter, items, lastMessage: state.lastMessage });
}

export function mutate(filter: "all" | "following" | "saved") {
  state.filter = filter;
  state.lastMessage = `Switched feed ranking to ${filter}.`;
  return snapshot();
}
