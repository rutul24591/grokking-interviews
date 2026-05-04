function climbStairsNaive(n) {
  if (n <= 2) return n;
  return climbStairsNaive(n - 1) + climbStairsNaive(n - 2);
}

if (require.main === module) {
  console.log(climbStairsNaive(5));
}

module.exports = { climbStairsNaive };
