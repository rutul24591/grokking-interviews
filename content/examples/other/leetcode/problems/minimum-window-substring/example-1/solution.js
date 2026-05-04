function minWindowBrute(s, t) {
  function covers(substr) {
    const need = new Map();
    for (const ch of t) need.set(ch, (need.get(ch) || 0) + 1);
    for (const ch of substr) {
      if (need.has(ch)) {
        need.set(ch, need.get(ch) - 1);
        if (need.get(ch) === 0) need.delete(ch);
      }
    }
    return need.size === 0;
  }

  let best = "";
  for (let i = 0; i < s.length; i += 1) {
    for (let j = i; j < s.length; j += 1) {
      const sub = s.slice(i, j + 1);
      if (best && sub.length >= best.length) continue;
      if (covers(sub)) best = sub;
    }
  }
  return best;
}

if (require.main === module) {
  console.log(minWindowBrute("ADOBECODEBANC", "ABC"));
}

module.exports = { minWindowBrute };
