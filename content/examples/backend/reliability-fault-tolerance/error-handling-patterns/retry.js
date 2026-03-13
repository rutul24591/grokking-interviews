async function retry(fn, max) {
  let attempt = 0;
  while (attempt < max) {
    try {
      return await fn();
    } catch {
      attempt += 1;
      await new Promise(r => setTimeout(r, 200));
    }
  }
  throw new Error('retry failed');
}