const indexState = {
  documents: [
    { id: "s-1", title: "Object storage", state: "indexed" as const, changedFields: ["title"], freshnessLagMinutes: 0 },
    { id: "s-2", title: "Rich text editor", state: "queued" as const, changedFields: ["body", "tags"], freshnessLagMinutes: 12 }
  ],
  lastRunAt: "2026-04-01T08:30:00Z",
  backlogSize: 1,
  lastMessage: "Search indexing should expose freshness and backlog so editors know when content becomes discoverable."
};

export function snapshot() {
  return structuredClone(indexState);
}

export function mutate(type: "run" | "mark-stale") {
  if (type === "run") {
    indexState.documents = indexState.documents.map((doc) => ({ ...doc, state: "indexed", freshnessLagMinutes: 0 }));
    indexState.lastRunAt = "2026-04-01T09:00:00Z";
    indexState.backlogSize = 0;
    indexState.lastMessage = "Processed queued documents into the search index.";
  }

  if (type === "mark-stale") {
    indexState.documents[0].state = "stale";
    indexState.documents[0].freshnessLagMinutes = 22;
    indexState.backlogSize = 1;
    indexState.lastMessage = "Detected stale search content after source document edits.";
  }

  return snapshot();
}
