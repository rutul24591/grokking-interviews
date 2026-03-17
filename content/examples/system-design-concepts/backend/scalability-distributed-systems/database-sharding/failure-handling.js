// Retry if shard is temporarily unavailable
async function queryWithRetry(route) {
  for (let i = 0; i < 3; i += 1) {
    try { return await shardPools[route.shard].query(route.sql); }
    catch (e) { await new Promise(r => setTimeout(r, 50 * (i + 1))); }
  }
  throw new Error('shard_unavailable');
}
