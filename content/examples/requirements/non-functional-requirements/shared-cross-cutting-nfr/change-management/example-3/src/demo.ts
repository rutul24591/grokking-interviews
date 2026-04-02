type Rollout = { change: string; configVersion: number; codeVersion: number; migrationReady: boolean };

function detectDrift(input: Rollout) {
  const drift = input.configVersion !== input.codeVersion || !input.migrationReady;
  return {
    change: input.change,
    drift,
    action: drift ? 'pause-rollout-and-reconcile' : 'continue-rollout',
  };
}

const results = [
  { change: 'search-ranking', configVersion: 12, codeVersion: 12, migrationReady: true },
  { change: 'billing-retry-policy', configVersion: 19, codeVersion: 18, migrationReady: false },
].map(detectDrift);

console.table(results);
if (!results[1].drift) throw new Error('Expected rollout drift to be detected');
