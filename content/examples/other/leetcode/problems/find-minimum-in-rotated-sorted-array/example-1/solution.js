function findMinLinear(nums) {
  let best = Infinity;
  for (const x of nums) best = Math.min(best, x);
  return best;
}

if (require.main === module) {
  console.log(findMinLinear([3, 4, 5, 1, 2]));
}

module.exports = { findMinLinear };
