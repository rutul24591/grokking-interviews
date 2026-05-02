function rabinKarp(text, pattern) {
  if (pattern.length === 0) return 0;
  const base = 257;
  const mod = 1_000_000_007;
  const m = pattern.length;
  let patHash = 0;
  let txtHash = 0;
  let pow = 1;

  for (let i = 0; i < m; i += 1) {
    patHash = (patHash * base + pattern.charCodeAt(i)) % mod;
    txtHash = (txtHash * base + text.charCodeAt(i)) % mod;
    if (i < m - 1) pow = (pow * base) % mod;
  }

  for (let i = 0; i <= text.length - m; i += 1) {
    if (patHash === txtHash) {
      if (text.slice(i, i + m) === pattern) return i;
    }
    if (i < text.length - m) {
      txtHash =
        (txtHash - text.charCodeAt(i) * pow) % mod;
      if (txtHash < 0) txtHash += mod;
      txtHash = (txtHash * base + text.charCodeAt(i + m)) % mod;
    }
  }

  return -1;
}

module.exports = { rabinKarp };
