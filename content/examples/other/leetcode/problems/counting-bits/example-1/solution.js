function countBitsNaive(n) {
  const out = new Array(n + 1).fill(0);
  for (let i = 0; i <= n; i += 1) {
    let x = i >>> 0;
    let count = 0;
    for (let b = 0; b < 32; b += 1) count += (x >>> b) & 1;
    out[i] = count;
  }
  return out;
}

if (require.main === module) {
  console.log(countBitsNaive(5));
}

module.exports = { countBitsNaive };
