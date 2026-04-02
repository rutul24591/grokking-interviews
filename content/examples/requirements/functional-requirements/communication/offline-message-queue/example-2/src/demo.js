function evaluateOfflineFlush(cases) {
  return cases.map((entry) => ({
    draft: entry.draft,
    flushNow: entry.networkRestored && entry.ackPending === 0 && !entry.expired,
    preserveOrder: entry.sequenceGap === 0,
    moveToManualRetry: entry.retryCount > 2
  }));
}

console.log(JSON.stringify(evaluateOfflineFlush([
  { draft: "draft-1", networkRestored: true, ackPending: 0, expired: false, sequenceGap: 0, retryCount: 0 },
  { draft: "draft-2", networkRestored: true, ackPending: 2, expired: false, sequenceGap: 1, retryCount: 1 },
  { draft: "draft-3", networkRestored: false, ackPending: 0, expired: true, sequenceGap: 0, retryCount: 4 }
]), null, 2));
