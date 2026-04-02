type Operation = { name: string; userVisible: boolean; financial: boolean; geoReplicated: boolean };

function chooseConsistency(operation: Operation) {
  return {
    operation: operation.name,
    consistency: operation.financial ? 'strict-serializable' : operation.userVisible && operation.geoReplicated ? 'read-your-writes' : 'eventual',
    repair: operation.geoReplicated ? 'attach-version-vector' : 'single-region-commit-log',
  };
}

const decisions = [
  { name: 'wallet-debit', userVisible: true, financial: true, geoReplicated: true },
  { name: 'profile-update', userVisible: true, financial: false, geoReplicated: true },
  { name: 'analytics-counter', userVisible: false, financial: false, geoReplicated: false },
].map(chooseConsistency);

console.table(decisions);
if (decisions[0].consistency !== 'strict-serializable') throw new Error('Wallet debits need strongest consistency');
