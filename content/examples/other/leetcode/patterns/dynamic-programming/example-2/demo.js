const assert = require("node:assert/strict");
const { minCoins } = require("../example-1/pattern");

function minCoinsMemo(coins, amount) {
  const memo = new Map();
  let calls = 0;
  let maxDepth = 0;

  function solve(a, depth) {
    calls += 1;
    if (depth > maxDepth) maxDepth = depth;
    if (a === 0) return 0;
    if (a < 0) return Infinity;
    if (memo.has(a)) return memo.get(a);

    let best = Infinity;
    for (const c of coins) best = Math.min(best, solve(a - c, depth + 1) + 1);
    memo.set(a, best);
    return best;
  }

  const ans = solve(amount, 1);
  return {
    value: Number.isFinite(ans) ? ans : -1,
    calls,
    maxDepth,
    memoEntries: memo.size,
  };
}

// Small correctness check (both approaches should match)
const coins = [1, 3, 4];
const amount = 6;
const memoRes = minCoinsMemo(coins, amount);
const tabRes = minCoins(coins, amount);
console.log("memo:", memoRes);
console.log("tabulation:", tabRes);
assert.equal(memoRes.value, tabRes);

// Follow-up: recursion depth can grow with `amount` (e.g., coin=1).
// This demonstrates the *shape* of the recursion rather than trying to crash the process.
const deeper = minCoinsMemo([1, 7, 10], 120);
console.log("memo depth demo:", { amount: 120, maxDepth: deeper.maxDepth, calls: deeper.calls });
assert.ok(deeper.maxDepth >= 100);

console.log("OK: memoization vs tabulation checks passed.");
