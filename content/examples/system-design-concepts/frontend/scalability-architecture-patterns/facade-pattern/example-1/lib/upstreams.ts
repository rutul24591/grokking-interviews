function jitter(minMs: number, maxMs: number) {
  return Math.floor(minMs + Math.random() * (maxMs - minMs));
}

async function delay(ms: number) {
  await new Promise((r) => setTimeout(r, ms));
}

export async function withTimeout<T>(p: Promise<T>, ms: number): Promise<T> {
  const timeout = new Promise<T>((_, reject) => setTimeout(() => reject(new Error("timeout")), ms));
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return Promise.race([p, timeout]);
}

export async function fetchProfile() {
  await delay(jitter(40, 180));
  if (Math.random() < 0.15) throw new Error("profile upstream error");
  return { userId: "u1", name: "Ada Lovelace" };
}

export async function fetchFeed() {
  await delay(jitter(60, 240));
  if (Math.random() < 0.2) throw new Error("feed upstream error");
  return {
    items: [
      { id: "p1", title: "Designing resilient frontends" },
      { id: "p2", title: "Latency budgets for dashboards" }
    ]
  };
}

export async function fetchBilling() {
  await delay(jitter(30, 200));
  if (Math.random() < 0.1) throw new Error("billing upstream error");
  return { plan: "Pro", renewalDate: new Date(Date.now() + 86400000 * 14).toISOString().slice(0, 10) };
}

