function detectFeedAnomalies(items) {
  const seen = new Set();
  const duplicates = [];
  const stale = [];
  for (const item of items) {
    if (seen.has(item.entityId)) {
      duplicates.push(item.id);
    }
    seen.add(item.entityId);
    if (item.staleMinutes > item.maxStaleness) {
      stale.push(item.id);
    }
  }
  return {
    duplicates,
    stale,
    triggerBackfill: stale.length > 0,
    removeRepeatedEntity: duplicates.length > 0
  };
}

console.log(detectFeedAnomalies([
  { id: "af-1", entityId: "post-1", staleMinutes: 4, maxStaleness: 10 },
  { id: "af-2", entityId: "post-1", staleMinutes: 22, maxStaleness: 10 },
  { id: "af-3", entityId: "post-3", staleMinutes: 17, maxStaleness: 12 }
]));
