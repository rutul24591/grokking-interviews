function isAnagram(a, b) {
  if (a.length !== b.length) return false;
  const count = new Map();
  for (const ch of a) count.set(ch, (count.get(ch) ?? 0) + 1);
  for (const ch of b) {
    const v = (count.get(ch) ?? 0) - 1;
    if (v < 0) return false;
    count.set(ch, v);
  }
  return true;
}
console.log(isAnagram("anagram","nagaram"));
console.log(isAnagram("rat","car"));
