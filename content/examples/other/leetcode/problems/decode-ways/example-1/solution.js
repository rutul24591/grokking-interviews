function numDecodingsTopDown(s) {
  const memo = new Map();
  function dfs(i) {
    if (i === s.length) return 1;
    if (s[i] === "0") return 0;
    if (memo.has(i)) return memo.get(i);

    let ways = dfs(i + 1);
    if (i + 1 < s.length) {
      const two = Number(s.slice(i, i + 2));
      if (two >= 10 && two <= 26) ways += dfs(i + 2);
    }
    memo.set(i, ways);
    return ways;
  }
  return dfs(0);
}

if (require.main === module) {
  console.log(numDecodingsTopDown("226"));
}

module.exports = { numDecodingsTopDown };
