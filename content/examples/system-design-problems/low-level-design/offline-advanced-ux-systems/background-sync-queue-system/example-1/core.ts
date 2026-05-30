export type BackgroundSyncQueueSystemStatus = "accepted" | "queued" | "blocked" | "conflicted" | "drained";

export interface BackgroundSyncQueueSystemOperation {
  id: string;
  actorId: string;
  resourceId: string;
  baseVersion: number;
  payload: Record<string, unknown>;
  createdAtMs: number;
  idempotencyKey: string;
  dependencies: string[];
}

export interface BackgroundSyncQueueSystemSnapshot {
  status: BackgroundSyncQueueSystemStatus;
  queueDepth: number;
  oldestPendingAgeMs: number;
  pending: BackgroundSyncQueueSystemOperation[];
  evidence: string[];
}

export class BackgroundSyncQueueSystemOutbox {
  private pending: BackgroundSyncQueueSystemOperation[] = [];
  private acknowledged = new Set<string>();
  private blockedReasons: string[] = [];

  enqueue(operation: BackgroundSyncQueueSystemOperation): BackgroundSyncQueueSystemSnapshot {
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

  acknowledge(idempotencyKey: string): BackgroundSyncQueueSystemSnapshot {
    this.acknowledged.add(idempotencyKey);
    this.pending = this.pending.filter((operation) => operation.idempotencyKey !== idempotencyKey);
    return this.snapshot(this.pending.length === 0 ? "drained" : "queued", ["server-ack-persisted"]);
  }

  nextReady(): BackgroundSyncQueueSystemOperation | undefined {
    const completed = new Set(this.acknowledged);
    return this.pending.find((operation) => operation.dependencies.every((dependency) => completed.has(dependency)));
  }

  markConflict(operationId: string, reason: string): BackgroundSyncQueueSystemSnapshot {
    this.blockedReasons.push(`${operationId}:${reason}`);
    return this.snapshot("conflicted", this.blockedReasons);
  }

  private snapshot(status: BackgroundSyncQueueSystemStatus, evidence: string[]): BackgroundSyncQueueSystemSnapshot {
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

export function runBackgroundSyncQueueSystemOutboxScenario() {
  const outbox = new BackgroundSyncQueueSystemOutbox();
  const operation = outbox.enqueue({
    id: "background-sync-queue-system-op-1",
    actorId: "user-42",
    resourceId: "doc-7",
    baseVersion: 12,
    payload: { topic: "background-sync-queue-system", action: "durable mutation queue" },
    createdAtMs: Date.now() - 1_200,
    idempotencyKey: "background-sync-queue-system:doc-7:12",
    dependencies: [],
  });
  const drained = outbox.acknowledge("background-sync-queue-system:doc-7:12");
  return { operation, drained };
}
