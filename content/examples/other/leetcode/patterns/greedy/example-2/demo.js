const assert = require("node:assert/strict");
const { selectActivities } = require("../example-1/pattern");

function greedyCoinChange(coinsDesc, amount) {
  const chosen = [];
  let remaining = amount;
  for (const coin of coinsDesc) {
    while (remaining >= coin) {
      chosen.push(coin);
      remaining -= coin;
    }
  }
  return remaining === 0 ? chosen : null;
}

function optimalCoinChange(coins, amount) {
  const dp = new Array(amount + 1).fill(Infinity);
  dp[0] = 0;
  for (let a = 1; a <= amount; a += 1) {
    for (const c of coins) if (a - c >= 0) dp[a] = Math.min(dp[a], dp[a - c] + 1);
  }
  return Number.isFinite(dp[amount]) ? dp[amount] : null;
}

// Case where a greedy strategy is provably correct: interval scheduling by earliest finish time.
const activities = [
  { id: "A", start: 1, end: 4 },
  { id: "B", start: 3, end: 5 },
  { id: "C", start: 0, end: 6 },
  { id: "D", start: 5, end: 7 },
  { id: "E", start: 8, end: 9 },
  { id: "F", start: 5, end: 9 },
];
const chosen = selectActivities(activities).map((a) => a.id);
console.log("Interval scheduling chosen:", chosen);
assert.deepEqual(chosen, ["A", "D", "E"]);

// Counterexample when the problem structure does NOT support greedy.
// Coins are NOT canonical, so "pick the biggest coin first" can be suboptimal.
const coins = [1, 3, 4];
const amount = 6;
const greedy = greedyCoinChange([...coins].sort((a, b) => b - a), amount);
const optimalCount = optimalCoinChange(coins, amount);
console.log("Coin change greedy:", greedy, "count:", greedy?.length);
console.log("Coin change optimal count:", optimalCount);
assert.equal(greedy?.length, 3); // 4+1+1
assert.equal(optimalCount, 2); // 3+3

// Production-ish check: deterministic tie-breaking.
// If two activities end at the same time, consistently pick the earlier-starting one for reproducible results.
const ties = [
  { id: "X", start: 1, end: 3 },
  { id: "Y", start: 0, end: 3 },
  { id: "Z", start: 3, end: 4 },
];
const stable = [...ties].sort((a, b) => (a.end - b.end) || (a.start - b.start)).map((a) => a.id);
console.log("Tie-broken order:", stable);
assert.deepEqual(stable, ["Y", "X", "Z"]);

console.log("OK: greedy proof obligation + counterexample checks passed.");
