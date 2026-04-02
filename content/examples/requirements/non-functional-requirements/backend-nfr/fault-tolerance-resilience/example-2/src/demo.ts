type Dependency = { name: string; errorRate: number; fallbackAvailable: boolean; stateful: boolean };

function chooseResilienceMode(dependency: Dependency) {
  const degraded = dependency.errorRate >= 0.1;
  return {
    dependency: dependency.name,
    mode: !degraded ? 'normal' : dependency.fallbackAvailable ? 'open-circuit-and-fallback' : dependency.stateful ? 'freeze-writes-and-buffer' : 'fail-fast',
  };
}

const results = [
  { name: 'pricing', errorRate: 0.18, fallbackAvailable: true, stateful: false },
  { name: 'payments-ledger', errorRate: 0.18, fallbackAvailable: false, stateful: true },
].map(chooseResilienceMode);

console.table(results);
if (results[1].mode !== 'freeze-writes-and-buffer') throw new Error('Ledger should freeze writes and buffer');
