type RegionWrite = { workload: string; writeConflicts: 'low' | 'high'; latencySensitive: boolean; complianceBound: boolean };

function chooseReplicationMode(input: RegionWrite) {
  return {
    workload: input.workload,
    mode: input.complianceBound ? 'single-writer-with-regional-follower' : input.writeConflicts === 'high' ? 'home-region-write-routing' : 'active-active-with-conflict-log',
  };
}

const results = [
  { workload: 'checkout', writeConflicts: 'high', latencySensitive: true, complianceBound: false },
  { workload: 'customer-profile', writeConflicts: 'low', latencySensitive: true, complianceBound: false },
  { workload: 'hr-records', writeConflicts: 'low', latencySensitive: false, complianceBound: true },
].map(chooseReplicationMode);

console.table(results);
if (results[2].mode !== 'single-writer-with-regional-follower') throw new Error('Compliance bound workload should stay single writer');
