function maxProfit(prices) {
  let best = 0;
  for (let i = 0; i < prices.length; i += 1) {
    for (let j = i + 1; j < prices.length; j += 1) {
      best = Math.max(best, prices[j] - prices[i]);
    }
  }
  return best;
}

if (require.main === module) {
  console.log(maxProfit([7,1,5,3,6,4]));
}

module.exports = { maxProfit };
