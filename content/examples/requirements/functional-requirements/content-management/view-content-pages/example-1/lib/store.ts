const viewState = {
  title: "Search indexing",
  status: "published" as "published" | "stale",
  assets: ["hero.png", "diagram.svg"],
  missingAssets: [] as string[],
  lastViewedBy: "reader-1024",
  currentVersion: 6,
  lastMessage: "Reader-facing content pages should expose stale state when underlying content or assets have drifted."
};

export function snapshot() {
  return structuredClone(viewState);
}

export function mutate(type: "mark-stale" | "refresh-view") {
  if (type === "mark-stale") {
    viewState.status = "stale";
    viewState.missingAssets = ["diagram.svg"];
    viewState.lastMessage = "Marked the page stale after underlying source content changed and one asset fell out of sync.";
  }

  if (type === "refresh-view") {
    viewState.status = "published";
    viewState.lastViewedBy = "reader-2048";
    viewState.missingAssets = [];
    viewState.currentVersion += 1;
    viewState.lastMessage = "Refreshed the page after the latest published content and assets were reloaded.";
  }

  return snapshot();
}
