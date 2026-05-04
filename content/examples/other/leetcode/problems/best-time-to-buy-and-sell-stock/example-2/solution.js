function maxProfit(prices) {
  let minSoFar = Infinity;
  let best = 0;
  for (const p of prices) {
    minSoFar = Math.min(minSoFar, p);
    best = Math.max(best, p - minSoFar);
  }
  return best;
}

if (require.main === module) {
  console.log(maxProfit([7,1,5,3,6,4]));
}

module.exports = { maxProfit };
