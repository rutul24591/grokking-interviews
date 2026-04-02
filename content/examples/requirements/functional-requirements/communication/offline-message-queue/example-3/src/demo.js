function detectOfflineQueueFailures(cases) {
  return cases.map((entry) => ({
    draft: entry.draft,
    suppressDuplicateFlush: entry.sameLocalId && entry.sameServerAck,
    expireWithoutSend: entry.storedMinutes > entry.ttlMinutes,
    rebuildQueueIndices: entry.orderCorrupted
  }));
}

console.log(JSON.stringify(detectOfflineQueueFailures([
  { draft: "draft-1", sameLocalId: true, sameServerAck: true, storedMinutes: 10, ttlMinutes: 60, orderCorrupted: false },
  { draft: "draft-2", sameLocalId: false, sameServerAck: false, storedMinutes: 95, ttlMinutes: 60, orderCorrupted: true },
  { draft: "draft-3", sameLocalId: false, sameServerAck: false, storedMinutes: 20, ttlMinutes: 60, orderCorrupted: false }
]), null, 2));
