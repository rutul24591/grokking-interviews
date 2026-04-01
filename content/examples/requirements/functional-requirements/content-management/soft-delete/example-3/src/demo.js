function visibilityLeak(record) {
  return {
    leaked: record.deleted && (record.visibleInFeed || record.indexedInSearch),
    action: record.deleted && (record.visibleInFeed || record.indexedInSearch) ? "remove-from-feed-and-search-cache" : "ok"
  };
}

console.log(visibilityLeak({ deleted: true, visibleInFeed: true, indexedInSearch: true }));
