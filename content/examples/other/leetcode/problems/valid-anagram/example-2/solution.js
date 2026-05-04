function isAnagramCounts(s, t) {
  if (s.length !== t.length) return false;
  const counts = new Array(26).fill(0);
  for (let i = 0; i < s.length; i += 1) {
    counts[s.charCodeAt(i) - 97] += 1;
    counts[t.charCodeAt(i) - 97] -= 1;
  }
  return counts.every((x) => x === 0);
}

if (require.main === module) {
  console.log(isAnagramCounts("anagram", "nagaram"));
  console.log(isAnagramCounts("rat", "car"));
}

module.exports = { isAnagramCounts };
