function buildBadChar(pattern) {
  const table = new Map();
  for (let i = 0; i < pattern.length; i += 1) {
    table.set(pattern[i], i);
  }
  return table;
}

function boyerMoore(text, pattern) {
  if (pattern.length === 0) return 0;
  const bad = buildBadChar(pattern);
  let shift = 0;
  while (shift <= text.length - pattern.length) {
    let j = pattern.length - 1;
    while (j >= 0 && pattern[j] === text[shift + j]) j -= 1;
    if (j < 0) return shift;
    const last = bad.get(text[shift + j]);
    shift += Math.max(1, j - (last ?? -1));
  }
  return -1;
}

module.exports = { boyerMoore };
