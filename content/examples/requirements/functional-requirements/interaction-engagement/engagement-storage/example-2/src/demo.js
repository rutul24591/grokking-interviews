function chooseStorageTier(events) {
  return events.map((event) => ({
    id: event.id,
    tier: event.latencyBudgetMs < 50 ? "hot" : event.retentionDays > 180 ? "archive" : "warm",
    replicate: event.globalReadTraffic === true,
    appendAuditTrail: event.isFinancialSignal || event.retentionDays > 365
  }));
}

console.log(chooseStorageTier([
  { id: "es-1", latencyBudgetMs: 35, retentionDays: 14, globalReadTraffic: true, isFinancialSignal: false },
  { id: "es-2", latencyBudgetMs: 180, retentionDays: 730, globalReadTraffic: false, isFinancialSignal: true }
]));
