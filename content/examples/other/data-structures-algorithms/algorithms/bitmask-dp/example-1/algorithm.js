function tspBitmask(dist) {
  const n = dist.length;
  const full = (1 << n) - 1;
  const memo = new Map();
  function solve(pos, mask) {
    const key = pos + "|" + mask;
    if (memo.has(key)) return memo.get(key);
    if (mask === full) return dist[pos][0];
    let best = Infinity;
    for (let next = 0; next < n; next += 1) {
      if (mask & (1 << next)) continue;
      best = Math.min(best, dist[pos][next] + solve(next, mask | (1 << next)));
    }
    memo.set(key, best);
    return best;
  }
  return solve(0, 1);
}

module.exports = { tspBitmask };
