export type Region = "us-east" | "eu-west";
type Versioned = { value: string; version: number };
type Replication = { deliverAtMs: number; from: Region; to: Region; key: string; value: string; version: number };

class MultiRegionKv {
  private data: Record<Region, Map<string, Versioned>> = {
    "us-east": new Map(),
    "eu-west": new Map()
  };
  private pending: Replication[] = [];
  private sessionLastWrite = new Map<string, number>();

  constructor(private readonly lagMs: number) {}

  put(region: Region, key: string, value: string, sessionId?: string) {
    const regionMap = this.data[region];
    const prev = regionMap.get(key);
    const version = (prev?.version ?? 0) + 1;
    regionMap.set(key, { value, version });
    if (sessionId) this.sessionLastWrite.set(sessionId, version);

    const other: Region = region === "us-east" ? "eu-west" : "us-east";
    this.pending.push({
      deliverAtMs: Date.now() + this.lagMs,
      from: region,
      to: other,
      key,
      value,
      version
    });

    return { version };
  }

  get(region: Region, key: string) {
    const vv = this.data[region].get(key);
    const leaderVersion = Math.max(
      this.data["us-east"].get(key)?.version ?? 0,
      this.data["eu-west"].get(key)?.version ?? 0
    );
    return { found: Boolean(vv), value: vv?.value ?? null, version: vv?.version ?? 0, leaderVersion };
  }

  requiredVersion(sessionId: string) {
    return this.sessionLastWrite.get(sessionId) ?? 0;
  }

  tick(nowMs = Date.now()) {
    const ready = this.pending.filter((p) => p.deliverAtMs <= nowMs);
    this.pending = this.pending.filter((p) => p.deliverAtMs > nowMs);

    for (const r of ready) {
      const dest = this.data[r.to];
      const existing = dest.get(r.key);
      if (!existing || r.version >= existing.version) {
        dest.set(r.key, { value: r.value, version: r.version });
      }
    }

    return { delivered: ready.length, pending: this.pending.length };
  }
}

export const kv = new MultiRegionKv(950);

