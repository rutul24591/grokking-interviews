function minWindow(s, t) {
  if (t.length === 0) return "";
  const need = new Map();
  for (const ch of t) need.set(ch, (need.get(ch) || 0) + 1);

  const window = new Map();
  let have = 0;
  const needKinds = need.size;

  let bestLen = Infinity;
  let bestLeft = 0;
  let left = 0;

  for (let right = 0; right < s.length; right += 1) {
    const ch = s[right];
    window.set(ch, (window.get(ch) || 0) + 1);
    if (need.has(ch) && window.get(ch) === need.get(ch)) have += 1;

    while (have === needKinds) {
      const len = right - left + 1;
      if (len < bestLen) {
        bestLen = len;
        bestLeft = left;
      }
      const drop = s[left];
      window.set(drop, window.get(drop) - 1);
      if (need.has(drop) && window.get(drop) < need.get(drop)) have -= 1;
      left += 1;
    }
  }

  return bestLen === Infinity ? "" : s.slice(bestLeft, bestLeft + bestLen);
}

if (require.main === module) {
  console.log(minWindow("ADOBECODEBANC", "ABC"));
}

module.exports = { minWindow };
