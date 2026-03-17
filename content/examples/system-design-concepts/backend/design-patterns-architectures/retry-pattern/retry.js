async function retry(fn, max) {
  for (let i = 0; i < max; i += 1) {
    try { return await fn(); } catch {
      const delay = Math.min(1000, 100 * (i + 1));
      await new Promise(r => setTimeout(r, delay));
    }
  }
  throw new Error('failed');
}
module.exports = { retry };