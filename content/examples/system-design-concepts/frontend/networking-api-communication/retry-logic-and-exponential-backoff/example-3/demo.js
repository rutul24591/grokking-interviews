for (const attempt of [1, 2, 3]) {
  const base = 200 * 2 ** (attempt - 1);
  const jitter = Math.round(base * 0.25);
  console.log(`attempt ${attempt} -> ${base - jitter} to ${base + jitter} ms`);
}
