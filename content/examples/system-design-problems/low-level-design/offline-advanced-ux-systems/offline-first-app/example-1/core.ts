export type OfflineFirstAppStatus = "accepted" | "queued" | "blocked" | "conflicted" | "drained";

export interface OfflineFirstAppOperation {
  id: string;
  actorId: string;
  resourceId: string;
  baseVersion: number;
  payload: Record<string, unknown>;
  createdAtMs: number;
  idempotencyKey: string;
  dependencies: string[];
}

export interface OfflineFirstAppSnapshot {
  status: OfflineFirstAppStatus;
  queueDepth: number;
  oldestPendingAgeMs: number;
  pending: OfflineFirstAppOperation[];
  evidence: string[];
}

export class OfflineFirstAppOutbox {
  private pending: OfflineFirstAppOperation[] = [];
  private acknowledged = new Set<string>();
  private blockedReasons: string[] = [];

  enqueue(operation: OfflineFirstAppOperation): OfflineFirstAppSnapshot {
    if (this.acknowledged.has(operation.idempotencyKey)) {
      return this.snapshot("drained", ["duplicate-replay-already-acknowledged"]);
    }
    if (operation.baseVersion < 0 || !operation.actorId) {
      this.blockedReasons.push("invalid-operation-scope");
      return this.snapshot("blocked", this.blockedReasons);
    }
    this.pending.push(operation);
    return this.snapshot("queued", ["durably-recorded-local-intent"]);
  }

  acknowledge(idempotencyKey: string): OfflineFirstAppSnapshot {
    this.acknowledged.add(idempotencyKey);
    this.pending = this.pending.filter((operation) => operation.idempotencyKey !== idempotencyKey);
    return this.snapshot(this.pending.length === 0 ? "drained" : "queued", ["server-ack-persisted"]);
  }

  nextReady(): OfflineFirstAppOperation | undefined {
    const completed = new Set(this.acknowledged);
    return this.pending.find((operation) => operation.dependencies.every((dependency) => completed.has(dependency)));
  }

  markConflict(operationId: string, reason: string): OfflineFirstAppSnapshot {
    this.blockedReasons.push(`${operationId}:${reason}`);
    return this.snapshot("conflicted", this.blockedReasons);
  }

  private snapshot(status: OfflineFirstAppStatus, evidence: string[]): OfflineFirstAppSnapshot {
    const now = Date.now();
    const oldest = this.pending.reduce((age, operation) => Math.max(age, now - operation.createdAtMs), 0);
    return {
      status,
      queueDepth: this.pending.length,
      oldestPendingAgeMs: oldest,
      pending: [...this.pending],
      evidence: [...evidence],
    };
  }
}

export function runOfflineFirstAppOutboxScenario() {
  const outbox = new OfflineFirstAppOutbox();
  const operation = outbox.enqueue({
    id: "offline-first-app-op-1",
    actorId: "user-42",
    resourceId: "doc-7",
    baseVersion: 12,
    payload: { topic: "offline-first-app", action: "offline-first application shell" },
    createdAtMs: Date.now() - 1_200,
    idempotencyKey: "offline-first-app:doc-7:12",
    dependencies: [],
  });
  const drained = outbox.acknowledge("offline-first-app:doc-7:12");
  return { operation, drained };
}
