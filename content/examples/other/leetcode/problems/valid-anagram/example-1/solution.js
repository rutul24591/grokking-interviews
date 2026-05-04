function isAnagramSort(s, t) {
  if (s.length !== t.length) return false;
  const a = s.split("").sort().join("");
  const b = t.split("").sort().join("");
  return a === b;
}

if (require.main === module) {
  console.log(isAnagramSort("anagram", "nagaram"));
  console.log(isAnagramSort("rat", "car"));
}

module.exports = { isAnagramSort };
