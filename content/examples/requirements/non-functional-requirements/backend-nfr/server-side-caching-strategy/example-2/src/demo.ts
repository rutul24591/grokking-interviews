type CacheCandidate = { dataset: string; readHeavy: boolean; mutationRatePerMinute: number; personalized: boolean };

function chooseServerCache(input: CacheCandidate) {
  return {
    dataset: input.dataset,
    strategy: input.personalized ? 'private-cache-or-bypass' : input.mutationRatePerMinute > 20 ? 'short-ttl-with-stale-while-revalidate' : input.readHeavy ? 'long-ttl-plus-prewarm' : 'targeted-cache',
  };
}

const results = [
  { dataset: 'home-feed', readHeavy: true, mutationRatePerMinute: 12, personalized: true },
  { dataset: 'catalog', readHeavy: true, mutationRatePerMinute: 4, personalized: false },
  { dataset: 'inventory', readHeavy: true, mutationRatePerMinute: 45, personalized: false },
].map(chooseServerCache);

console.table(results);
if (results[2].strategy !== 'short-ttl-with-stale-while-revalidate') throw new Error('Inventory should use short TTL');
