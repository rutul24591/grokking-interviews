export type Value = { key: string; value: string; version: number; updatedAt: string };

type Replica = { name: string; lagMs: number; value: Value };

type Store = {
  primary: Value;
  replicas: Replica[];
  sessionLastWrite: Map<string, number>;
};

const store: Store =
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ((globalThis as any).__CONS_STORE__ as Store | undefined) ?? {
    primary: { key: "k", value: "v1", version: 1, updatedAt: new Date().toISOString() },
    replicas: [
      { name: "r1", lagMs: 300, value: { key: "k", value: "v1", version: 1, updatedAt: new Date().toISOString() } },
      { name: "r2", lagMs: 800, value: { key: "k", value: "v1", version: 1, updatedAt: new Date().toISOString() } },
    ],
    sessionLastWrite: new Map(),
  };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(globalThis as any).__CONS_STORE__ = store;

export function reset() {
  const now = new Date().toISOString();
  store.primary = { key: "k", value: "v1", version: 1, updatedAt: now };
  store.replicas = [
    { name: "r1", lagMs: 300, value: { key: "k", value: "v1", version: 1, updatedAt: now } },
    { name: "r2", lagMs: 800, value: { key: "k", value: "v1", version: 1, updatedAt: now } },
  ];
  store.sessionLastWrite.clear();
}

export function write(sessionId: string, value: string) {
  store.primary = {
    ...store.primary,
    value,
    version: store.primary.version + 1,
    updatedAt: new Date().toISOString(),
  };
  store.sessionLastWrite.set(sessionId, store.primary.version);

  for (const r of store.replicas) {
    const v = store.primary;
    setTimeout(() => {
      r.value = { ...v };
    }, r.lagMs);
  }

  return store.primary;
}

export function read(params: { consistency: "eventual" | "read-your-writes"; sessionId: string }) {
  const desired = store.sessionLastWrite.get(params.sessionId) ?? 0;
  if (params.consistency === "read-your-writes" && store.primary.version < desired) {
    // Shouldn't happen in this model; primary always has the write.
    return { source: "primary", value: store.primary, stale: false };
  }

  if (params.consistency === "read-your-writes") {
    // If replicas haven't caught up to the session's last write, serve from primary.
    const bestReplica = store.replicas.reduce((a, b) => (a.value.version >= b.value.version ? a : b));
    if (bestReplica.value.version < desired) return { source: "primary", value: store.primary, stale: false };
    return { source: bestReplica.name, value: bestReplica.value, stale: bestReplica.value.version < store.primary.version };
  }

  // eventual: randomly pick a replica
  const r = store.replicas[Math.floor(Math.random() * store.replicas.length)];
  return { source: r.name, value: r.value, stale: r.value.version < store.primary.version };
}

export function status() {
  return {
    primary: store.primary,
    replicas: store.replicas.map((r) => ({ name: r.name, lagMs: r.lagMs, value: r.value })),
  };
}

