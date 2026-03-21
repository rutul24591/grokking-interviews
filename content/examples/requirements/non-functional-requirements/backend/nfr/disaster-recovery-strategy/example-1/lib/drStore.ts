import { randomUUID } from "node:crypto";

type Order = { id: string; amountUsd: number; createdAt: string };
type Snapshot = { id: string; ts: string; state: Record<string, Order> };

class DRStore {
  primaryUp = true;
  primary = new Map<string, Order>();
  snapshots: Snapshot[] = [];

  writeOrder(amountUsd: number) {
    if (!this.primaryUp) throw new Error("primary_down");
    const id = randomUUID();
    const o: Order = { id, amountUsd, createdAt: new Date().toISOString() };
    this.primary.set(id, o);
    return o;
  }

  getOrder(id: string) {
    return this.primary.get(id) ?? null;
  }

  snapshot() {
    const id = randomUUID();
    const state: Record<string, Order> = {};
    for (const [k, v] of this.primary.entries()) state[k] = v;
    const s: Snapshot = { id, ts: new Date().toISOString(), state };
    this.snapshots.push(s);
    return s;
  }

  outage() {
    this.primaryUp = false;
  }

  restore(snapshotId: string) {
    const s = this.snapshots.find((x) => x.id === snapshotId);
    if (!s) throw new Error("snapshot_not_found");
    this.primary = new Map(Object.entries(s.state));
    this.primaryUp = true;
    return s;
  }

  status() {
    return {
      primaryUp: this.primaryUp,
      primaryOrders: this.primary.size,
      snapshots: this.snapshots.map((s) => ({ id: s.id, ts: s.ts, orders: Object.keys(s.state).length }))
    };
  }
}

export const dr = new DRStore();

