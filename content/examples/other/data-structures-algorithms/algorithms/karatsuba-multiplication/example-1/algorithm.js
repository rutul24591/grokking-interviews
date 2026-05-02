function karatsuba(x, y) {
  if (x < 10n || y < 10n) return x * y;
  const xStr = x.toString();
  const yStr = y.toString();
  const n = BigInt(Math.max(xStr.length, yStr.length));
  const m = n / 2n;
  const pow = 10n ** m;

  const high1 = x / pow;
  const low1 = x % pow;
  const high2 = y / pow;
  const low2 = y % pow;

  const z0 = karatsuba(low1, low2);
  const z1 = karatsuba(low1 + high1, low2 + high2);
  const z2 = karatsuba(high1, high2);

  return z2 * (pow ** 2n) + (z1 - z2 - z0) * pow + z0;
}

module.exports = { karatsuba };
