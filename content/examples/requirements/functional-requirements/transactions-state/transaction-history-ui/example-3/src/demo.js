function detectTransactionHistoryEdgeCases(records) {
  const analysis = records.map((record) => ({
    id: record.id,
    staleCache: record.cacheAgeMinutes > record.maxCacheAgeMinutes,
    missingLedgerLink: !record.ledgerReference,
    timelineGap: record.expectedEvents !== record.actualEvents,
    action:
      record.cacheAgeMinutes > record.maxCacheAgeMinutes ? "refetch-history" :
      !record.ledgerReference ? "show-audit-fallback" :
      record.expectedEvents !== record.actualEvents ? "repair-timeline" : "continue"
  }));

  return {
    analysis,
    refetchHistory: analysis.some((entry) => entry.staleCache),
    repairTimeline: analysis.some((entry) => entry.timelineGap)
  };
}

console.log(JSON.stringify(detectTransactionHistoryEdgeCases([
  { id: "txn-1", cacheAgeMinutes: 50, maxCacheAgeMinutes: 15, ledgerReference: true, expectedEvents: 3, actualEvents: 3 },
  { id: "txn-2", cacheAgeMinutes: 5, maxCacheAgeMinutes: 15, ledgerReference: false, expectedEvents: 4, actualEvents: 4 },
  { id: "txn-3", cacheAgeMinutes: 5, maxCacheAgeMinutes: 15, ledgerReference: true, expectedEvents: 5, actualEvents: 3 }
]), null, 2));
