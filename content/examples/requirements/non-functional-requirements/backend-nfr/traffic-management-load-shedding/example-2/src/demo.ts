type RequestClass = { name: string; priority: 'critical' | 'interactive' | 'batch'; currentCpu: number; queueDepth: number };

function chooseLoadShedding(action: RequestClass) {
  const overloaded = action.currentCpu >= 85 || action.queueDepth >= 120;
  return {
    queue: action.name,
    overloaded,
    decision: !overloaded ? 'admit' : action.priority === 'critical' ? 'admit-with-budget' : 'drop-and-retry-later',
  };
}

const results = [
  { name: 'checkout', priority: 'critical', currentCpu: 91, queueDepth: 150 },
  { name: 'search-suggestions', priority: 'interactive', currentCpu: 91, queueDepth: 150 },
  { name: 'analytics-rollup', priority: 'batch', currentCpu: 91, queueDepth: 150 },
].map(chooseLoadShedding);

console.table(results);
if (results[2].decision !== 'drop-and-retry-later') throw new Error('Batch workload should be shed first');
