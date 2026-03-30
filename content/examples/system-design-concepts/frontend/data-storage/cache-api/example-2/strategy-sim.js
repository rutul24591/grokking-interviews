function simulate(name, policy) {
  const cached = { stale: true };
  const networkOk = false;
  if (policy === "cache-first") return { name, source: "cache", stale: cached.stale };
  if (policy === "network-first") return { name, source: networkOk ? "network" : "cache", stale: !networkOk };
  return { name, source: "cache-then-network", stale: true };
}

console.log(simulate("article detail", "cache-first"));
console.log(simulate("pricing panel", "network-first"));
console.log(simulate("feed cards", "stale-while-revalidate"));

