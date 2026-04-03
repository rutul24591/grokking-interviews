type Dependency = { name: string; estimatedMs: number; optional: boolean; remainingBudgetMs: number };

function decideDependencyBudget(dep: Dependency) {
  const affordable = dep.remainingBudgetMs >= dep.estimatedMs;
  return {
    dependency: dep.name,
    affordable,
    decision: affordable ? 'execute' : dep.optional ? 'skip-and-serve-degraded' : 'fail-fast',
  };
}

const decisions = [
  { name: 'cache', estimatedMs: 20, optional: true, remainingBudgetMs: 40 },
  { name: 'recommendations', estimatedMs: 120, optional: true, remainingBudgetMs: 35 },
  { name: 'auth', estimatedMs: 45, optional: false, remainingBudgetMs: 30 },
].map(decideDependencyBudget);

console.table(decisions);
if (decisions[1].decision !== 'skip-and-serve-degraded') throw new Error('Optional recommendations should be skipped');
if (decisions[2].decision !== 'fail-fast') throw new Error('Required auth should fail fast');
