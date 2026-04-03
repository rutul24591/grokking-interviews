type ResizePlan = { currentShards: number; projectedKeys: number; rebalancePct: number };

function assessResize(plan: ResizePlan) {
  const needResize = plan.projectedKeys / plan.currentShards > 250_000;
  return {
    ...plan,
    needResize,
    action: needResize && plan.rebalancePct < 0.2 ? 'increase-shards-now' : needResize ? 'stage-dual-write-migration' : 'hold-capacity',
  };
}

const results = [
  { currentShards: 4, projectedKeys: 1_200_000, rebalancePct: 0.18 },
  { currentShards: 8, projectedKeys: 900_000, rebalancePct: 0.28 },
].map(assessResize);

console.table(results);
if (results[0].action !== 'increase-shards-now') throw new Error('Four-shard cluster should scale immediately');
