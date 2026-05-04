function countBits(n) {
  const out = new Array(n + 1).fill(0);
  for (let i = 1; i <= n; i += 1) {
    out[i] = out[i >>> 1] + (i & 1);
  }
  return out;
}

if (require.main === module) {
  console.log(countBits(5));
}

module.exports = { countBits };
