function lengthOfLongestSubstring(s) {
  const last = new Map();
  let left = 0;
  let best = 0;
  for (let right = 0; right < s.length; right += 1) {
    const ch = s[right];
    if (last.has(ch)) left = Math.max(left, last.get(ch) + 1);
    last.set(ch, right);
    best = Math.max(best, right - left + 1);
  }
  return best;
}

if (require.main === module) {
  console.log(lengthOfLongestSubstring("abcabcbb"));
}

module.exports = { lengthOfLongestSubstring };
