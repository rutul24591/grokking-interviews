function numDecodings(s) {
  if (s.length === 0) return 0;
  let dp2 = 1;
  let dp1 = s[0] === "0" ? 0 : 1;
  for (let i = 2; i <= s.length; i += 1) {
    let cur = 0;
    if (s[i - 1] !== "0") cur += dp1;
    const two = Number(s.slice(i - 2, i));
    if (two >= 10 && two <= 26) cur += dp2;
    dp2 = dp1;
    dp1 = cur;
  }
  return dp1;
}

if (require.main === module) {
  console.log(numDecodings("226"));
}

module.exports = { numDecodings };
