type MemoryCase = { component: string; retainedMb: number; detachedNodes: number; unclosedSubscriptions: number };

function classifyLeakRisk(input: MemoryCase) {
  const riskScore = input.retainedMb + input.detachedNodes * 2 + input.unclosedSubscriptions * 5;
  return {
    component: input.component,
    riskScore,
    status: riskScore >= 25 ? 'leak-risk' : 'healthy',
    fix: input.unclosedSubscriptions > 0 ? 'cleanup-effect-subscribers' : 'prune-detached-dom-and-cache',
  };
}

const results = [
  { component: 'chart-grid', retainedMb: 8, detachedNodes: 2, unclosedSubscriptions: 0 },
  { component: 'notifications-panel', retainedMb: 6, detachedNodes: 1, unclosedSubscriptions: 4 },
].map(classifyLeakRisk);

console.table(results);
if (results[1].status !== 'leak-risk') throw new Error('Notifications panel should be classified as leak risk');
