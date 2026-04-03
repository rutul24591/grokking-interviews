type RestoreCase = { system: string; latestSnapshotMinutesAgo: number; writeLossMinutes: number; manualSteps: number };

function evaluateRestoreRisk(input: RestoreCase) {
  const exceedsRpo = input.writeLossMinutes > 5;
  const slowRecovery = input.manualSteps > 4;
  return {
    system: input.system,
    exceedsRpo,
    slowRecovery,
    status: exceedsRpo || slowRecovery ? 'not-ready-for-signoff' : 'ready-for-dr-drill',
  };
}

const results = [
  { system: 'orders', latestSnapshotMinutesAgo: 3, writeLossMinutes: 2, manualSteps: 2 },
  { system: 'catalog', latestSnapshotMinutesAgo: 45, writeLossMinutes: 18, manualSteps: 6 },
].map(evaluateRestoreRisk);

console.table(results);
if (results[1].status !== 'not-ready-for-signoff') throw new Error('Catalog recovery should fail DR signoff');
