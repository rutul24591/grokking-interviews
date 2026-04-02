function planBookmarkWrites(requests) {
  return requests.map((request) => ({
    id: request.id,
    mode: request.offline ? "local-queue" : request.crossDevice ? "direct-write-with-version-check" : "direct-write",
    reconcileCollection: request.collectionChanged && request.saved,
    pinForSyncBanner: request.saved && request.offline
  }));
}

console.log(planBookmarkWrites([
  { id: "bm-1", offline: true, collectionChanged: true, saved: true, crossDevice: false },
  { id: "bm-2", offline: false, collectionChanged: false, saved: true, crossDevice: true }
]));
