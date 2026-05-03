function factorial(n) {
  if (n < 0) throw new Error("n must be non-negative");
  if (n <= 1) return 1;
  return n * factorial(n - 1);
}

module.exports = { factorial };
