function climbStairs(n) {
  if (n <= 2) return n;
  let prev2 = 1;
  let prev1 = 2;
  for (let i = 3; i <= n; i += 1) {
    const next = prev1 + prev2;
    prev2 = prev1;
    prev1 = next;
  }
  return prev1;
}

if (require.main === module) {
  console.log(climbStairs(5));
}

module.exports = { climbStairs };
