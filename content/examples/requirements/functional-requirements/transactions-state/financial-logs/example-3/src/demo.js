function detectFinancialLogEdgeCases(entries) {
  const missingLedgerEntries = entries.filter((entry) => !entry.ledgerWritten).map((entry) => entry.id);
  const balanceMismatch = entries.filter((entry) => entry.expected !== entry.actual).map((entry) => entry.id);
  return {
    missingLedgerEntries,
    balanceMismatch,
    freezeCloseProcess: balanceMismatch.length > 0,
    replayFromJournal: missingLedgerEntries.length > 0
  };
}

console.log(detectFinancialLogEdgeCases([
  { id: "log-1", ledgerWritten: false, expected: 120, actual: 120 },
  { id: "log-2", ledgerWritten: true, expected: 400, actual: 380 }
]));
