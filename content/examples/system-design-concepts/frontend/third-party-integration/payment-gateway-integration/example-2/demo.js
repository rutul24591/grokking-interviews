const seen = new Set();
for (const key of ["checkout_1", "checkout_1", "checkout_2"]) {
  const firstTime = !seen.has(key);
  seen.add(key);
  console.log(`${key} -> ${firstTime ? "create charge" : "return existing payment result"}`);
}
