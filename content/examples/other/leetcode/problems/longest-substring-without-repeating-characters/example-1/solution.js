function lengthOfLongestSubstringBrute(s) {
  let best = 0;
  for (let i = 0; i < s.length; i += 1) {
    const seen = new Set();
    for (let j = i; j < s.length; j += 1) {
      if (seen.has(s[j])) break;
      seen.add(s[j]);
      best = Math.max(best, j - i + 1);
    }
  }
  return best;
}

if (require.main === module) {
  console.log(lengthOfLongestSubstringBrute("abcabcbb"));
}

module.exports = { lengthOfLongestSubstringBrute };
