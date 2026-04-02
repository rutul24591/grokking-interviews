function detectStateMachineEdgeCases(cases) {
  const analysis = cases.map((entry) => ({
    id: entry.id,
    skippedStates: entry.jumpCount > 1,
    repeats: entry.current === entry.next,
    missingCompensation: entry.rollbackRequested && !entry.compensationPath,
    action:
      entry.jumpCount > 1 ? "reject-transition" :
      entry.current === entry.next ? "suppress-noop" :
      entry.rollbackRequested && !entry.compensationPath ? "block-rollback" : "continue"
  }));

  return {
    analysis,
    alertOnCorruption: analysis.some((entry) => entry.skippedStates),
    blockRollback: analysis.some((entry) => entry.missingCompensation)
  };
}

console.log(JSON.stringify(detectStateMachineEdgeCases([
  { id: "tx-1", jumpCount: 2, current: "created", next: "captured", rollbackRequested: false, compensationPath: false },
  { id: "tx-2", jumpCount: 0, current: "authorized", next: "authorized", rollbackRequested: false, compensationPath: false },
  { id: "tx-3", jumpCount: 0, current: "captured", next: "refunded", rollbackRequested: true, compensationPath: false }
]), null, 2));
