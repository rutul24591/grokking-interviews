import { randomUUID } from "node:crypto";

export type Event = {
  id: string;
  userId: string;
  kind: string;
  createdAt: string; // ISO
  payload: Record<string, unknown>;
};

export type RetentionPolicy = {
  archiveAfterDays: number;
  deleteAfterDays: number;
};

function ageDays(nowMs: number, iso: string) {
  const ts = new Date(iso).getTime();
  return (nowMs - ts) / (1000 * 60 * 60 * 24);
}

class RetentionStore {
  policy: RetentionPolicy = { archiveAfterDays: 7, deleteAfterDays: 30 };
  legalHolds = new Set<string>(); // userId

  active: Event[] = [];
  archive: Event[] = [];

  ingest(params: { userId: string; kind: string; createdAt?: string; payload?: Record<string, unknown> }) {
    const e: Event = {
      id: randomUUID(),
      userId: params.userId,
      kind: params.kind,
      createdAt: params.createdAt || new Date().toISOString(),
      payload: params.payload || {}
    };
    this.active.push(e);
    return e;
  }

  setLegalHold(userId: string, enabled: boolean) {
    if (enabled) this.legalHolds.add(userId);
    else this.legalHolds.delete(userId);
  }

  query(store: "active" | "archive", userId?: string) {
    const src = store === "active" ? this.active : this.archive;
    return userId ? src.filter((e) => e.userId === userId) : src;
  }

  runRetention(nowMs = Date.now()) {
    const before = this.active.length;
    const nextActive: Event[] = [];
    let archived = 0;
    let deleted = 0;

    for (const e of this.active) {
      if (this.legalHolds.has(e.userId)) {
        nextActive.push(e);
        continue;
      }
      const days = ageDays(nowMs, e.createdAt);
      if (days >= this.policy.deleteAfterDays) {
        deleted++;
        continue;
      }
      if (days >= this.policy.archiveAfterDays) {
        this.archive.push(e);
        archived++;
        continue;
      }
      nextActive.push(e);
    }

    this.active = nextActive;
    return { before, after: this.active.length, archived, deleted, archiveSize: this.archive.length };
  }
}

export const store = new RetentionStore();

