type CacheCase = { dataset: string; writeRate: 'low' | 'medium' | 'high'; staleToleranceSec: number; fanout: 'small' | 'large' };

function chooseCachePolicy(input: CacheCase) {
  if (input.staleToleranceSec === 0) return { ...input, policy: 'write-through-or-bypass' };
  if (input.writeRate === 'high' && input.fanout === 'large') return { ...input, policy: 'event-invalidation-with-version-key' };
  return { ...input, policy: 'ttl-cache-with-background-refresh' };
}

const policies = [
  { dataset: 'account-balance', writeRate: 'high', staleToleranceSec: 0, fanout: 'small' },
  { dataset: 'inventory', writeRate: 'high', staleToleranceSec: 5, fanout: 'large' },
  { dataset: 'help-center', writeRate: 'low', staleToleranceSec: 300, fanout: 'large' },
].map(chooseCachePolicy);

console.table(policies);
if (policies[1].policy !== 'event-invalidation-with-version-key') throw new Error('Inventory should use event invalidation');

console.log(JSON.stringify({ ok: true }, null, 2));
