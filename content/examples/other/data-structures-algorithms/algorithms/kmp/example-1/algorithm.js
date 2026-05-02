function buildLps(pattern) {
  const lps = new Array(pattern.length).fill(0);
  let len = 0;
  let i = 1;
  while (i < pattern.length) {
    if (pattern[i] === pattern[len]) {
      len += 1;
      lps[i] = len;
      i += 1;
    } else if (len !== 0) {
      len = lps[len - 1];
    } else {
      lps[i] = 0;
      i += 1;
    }
  }
  return lps;
}

function kmpSearch(text, pattern) {
  if (pattern.length === 0) return 0;
  const lps = buildLps(pattern);
  let i = 0;
  let j = 0;
  while (i < text.length) {
    if (text[i] === pattern[j]) {
      i += 1;
      j += 1;
      if (j === pattern.length) return i - j;
    } else if (j !== 0) {
      j = lps[j - 1];
    } else {
      i += 1;
    }
  }
  return -1;
}

module.exports = { buildLps, kmpSearch };
