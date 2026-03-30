function classify(age, maxAge, swr) {
  if (age <= maxAge) return 'fresh';
  if (age <= maxAge + swr) return 'serve-stale-and-revalidate';
  return 'expired';
}
console.log([10, 40, 400].map((age) => ({ age, state: classify(age, 30, 300) })));
