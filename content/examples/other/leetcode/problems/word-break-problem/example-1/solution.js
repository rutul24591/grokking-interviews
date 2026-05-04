function wordBreakTopDown(s, wordDict) {
  const words = new Set(wordDict);
  const memo = new Map();

  function dfs(i) {
    if (i === s.length) return true;
    if (memo.has(i)) return memo.get(i);
    for (let j = i + 1; j <= s.length; j += 1) {
      const piece = s.slice(i, j);
      if (words.has(piece) && dfs(j)) {
        memo.set(i, true);
        return true;
      }
    }
    memo.set(i, false);
    return false;
  }

  return dfs(0);
}

if (require.main === module) {
  console.log(wordBreakTopDown("leetcode", ["leet", "code"]));
}

module.exports = { wordBreakTopDown };
