import { randomUUID } from "node:crypto";

type VersionedValue = { value: string; version: number };
type PendingReplication = { deliverAtMs: number; key: string; value: string; version: number };

class ReplicatedKv {
  private leader = new Map<string, VersionedValue>();
  private follower = new Map<string, VersionedValue>();
  private pending: PendingReplication[] = [];
  private sessionLastWriteVersion = new Map<string, number>();

  constructor(private replicationDelayMs: number) {}

  put(key: string, value: string, sessionId?: string) {
    const prev = this.leader.get(key);
    const version = (prev?.version ?? 0) + 1;
    this.leader.set(key, { value, version });

    if (sessionId) this.sessionLastWriteVersion.set(sessionId, version);

    this.pending.push({
      deliverAtMs: Date.now() + this.replicationDelayMs,
      key,
      value,
      version
    });

    return { version, sessionId: sessionId || randomUUID() };
  }

  get(key: string, read: "leader" | "follower") {
    const src = read === "leader" ? this.leader : this.follower;
    const vv = src.get(key);
    const leaderVersion = this.leader.get(key)?.version ?? 0;
    return {
      found: Boolean(vv),
      value: vv?.value ?? null,
      version: vv?.version ?? 0,
      leaderVersion
    };
  }

  sessionRequiresVersion(sessionId: string) {
    return this.sessionLastWriteVersion.get(sessionId) ?? 0;
  }

  tick(nowMs = Date.now()) {
    const ready = this.pending.filter((p) => p.deliverAtMs <= nowMs);
    this.pending = this.pending.filter((p) => p.deliverAtMs > nowMs);

    for (const p of ready) {
      const existing = this.follower.get(p.key);
      if (!existing || p.version >= existing.version) {
        this.follower.set(p.key, { value: p.value, version: p.version });
      }
    }

    return { delivered: ready.length, pending: this.pending.length };
  }
}

export const kv = new ReplicatedKv(900);

