type CollectionView = "all" | "interview-prep" | "backend";

const state = {
  collectionView: "all" as CollectionView,
  collections: [
    { id: "all", label: "All bookmarks", pendingWrites: 0 },
    { id: "interview-prep", label: "Interview prep", pendingWrites: 1 },
    { id: "backend", label: "Backend", pendingWrites: 0 }
  ],
  items: [
    {
      id: "bm-1",
      title: "API gateway checklist",
      collection: "interview-prep",
      saved: true,
      syncState: "synced",
      note: "Pinned to interview prep for onsite review."
    },
    {
      id: "bm-2",
      title: "Queue backpressure",
      collection: "backend",
      saved: true,
      syncState: "queued",
      note: "Saved offline on tablet; sync pending."
    },
    {
      id: "bm-3",
      title: "Feed ranking notes",
      collection: "interview-prep",
      saved: false,
      syncState: "idle",
      note: "Recommended from explore page."
    }
  ],
  lastMessage: "Bookmark UIs should preserve collection context and expose sync risk when saves happen across devices."
};

export function snapshot() {
  const items = state.collectionView === "all"
    ? state.items
    : state.items.filter((item) => item.collection === state.collectionView);
  const savedCount = state.items.filter((item) => item.saved).length;
  const pendingSync = state.items.filter((item) => item.syncState === "queued").length;
  return structuredClone({
    collectionView: state.collectionView,
    collections: state.collections.map((collection) => ({
      ...collection,
      count: collection.id === "all"
        ? state.items.filter((item) => item.saved).length
        : state.items.filter((item) => item.collection === collection.id && item.saved).length
    })),
    items,
    savedCount,
    pendingSync,
    lastMessage: state.lastMessage
  });
}

export function mutate(type: "switch-collection" | "toggle-save", value?: string) {
  if (type === "switch-collection" && value) {
    state.collectionView = value as CollectionView;
    state.lastMessage = `Viewing ${state.collectionView === "all" ? "all saved articles" : `${state.collectionView} collection`} with sync status.`;
    return snapshot();
  }
  if (type === "toggle-save" && value) {
    state.items = state.items.map((item) => {
      if (item.id !== value) {
        return item;
      }
      const saved = !item.saved;
      return {
        ...item,
        saved,
        syncState: saved ? (item.collection === "backend" ? "queued" : "synced") : "idle",
        note: saved ? "Saved from the current reading surface." : "Removed from the visible collection."
      };
    });
    state.lastMessage = `Updated bookmark state for ${value}. Items saved offline remain queued until background sync completes.`;
  }
  return snapshot();
}
