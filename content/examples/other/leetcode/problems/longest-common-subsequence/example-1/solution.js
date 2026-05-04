function lcsNaive(text1, text2) {
  function dfs(i, j) {
    if (i === text1.length || j === text2.length) return 0;
    if (text1[i] === text2[j]) return 1 + dfs(i + 1, j + 1);
    return Math.max(dfs(i + 1, j), dfs(i, j + 1));
  }
  return dfs(0, 0);
}

if (require.main === module) {
  console.log(lcsNaive("abcde", "ace"));
}

module.exports = { lcsNaive };
