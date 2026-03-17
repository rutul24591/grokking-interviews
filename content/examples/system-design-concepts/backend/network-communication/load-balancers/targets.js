const targets = [
  { url: "http://localhost:5001", healthy: true, failures: 0 },
  { url: "http://localhost:5002", healthy: true, failures: 0 },
];
let index = 0;

export function pickTarget() {
  const healthy = targets.filter((t) => t.healthy);
  if (healthy.length === 0) return null;
  index = (index + 1) % healthy.length;
  return healthy[index].url;
}

export function reportFailure(url) {
  const t = targets.find((x) => x.url === url);
  if (!t) return;
  t.failures += 1;
  if (t.failures >= 3) t.healthy = false;
}