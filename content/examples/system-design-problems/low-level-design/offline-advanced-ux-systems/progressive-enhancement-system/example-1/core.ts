export type ProgressiveEnhancementSystemStatus = "accepted" | "queued" | "blocked" | "conflicted" | "drained";

export interface ProgressiveEnhancementSystemOperation {
  id: string;
  actorId: string;
  resourceId: string;
  baseVersion: number;
  payload: Record<string, unknown>;
  createdAtMs: number;
  idempotencyKey: string;
  dependencies: string[];
}

export interface ProgressiveEnhancementSystemSnapshot {
  status: ProgressiveEnhancementSystemStatus;
  queueDepth: number;
  oldestPendingAgeMs: number;
  pending: ProgressiveEnhancementSystemOperation[];
  evidence: string[];
}

export class ProgressiveEnhancementSystemOutbox {
  private pending: ProgressiveEnhancementSystemOperation[] = [];
  private acknowledged = new Set<string>();
  private blockedReasons: string[] = [];

  enqueue(operation: ProgressiveEnhancementSystemOperation): ProgressiveEnhancementSystemSnapshot {
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

  acknowledge(idempotencyKey: string): ProgressiveEnhancementSystemSnapshot {
    this.acknowledged.add(idempotencyKey);
    this.pending = this.pending.filter((operation) => operation.idempotencyKey !== idempotencyKey);
    return this.snapshot(this.pending.length === 0 ? "drained" : "queued", ["server-ack-persisted"]);
  }

  nextReady(): ProgressiveEnhancementSystemOperation | undefined {
    const completed = new Set(this.acknowledged);
    return this.pending.find((operation) => operation.dependencies.every((dependency) => completed.has(dependency)));
  }

  markConflict(operationId: string, reason: string): ProgressiveEnhancementSystemSnapshot {
    this.blockedReasons.push(`${operationId}:${reason}`);
    return this.snapshot("conflicted", this.blockedReasons);
  }

  private snapshot(status: ProgressiveEnhancementSystemStatus, evidence: string[]): ProgressiveEnhancementSystemSnapshot {
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

export function runProgressiveEnhancementSystemOutboxScenario() {
  const outbox = new ProgressiveEnhancementSystemOutbox();
  const operation = outbox.enqueue({
    id: "progressive-enhancement-system-op-1",
    actorId: "user-42",
    resourceId: "doc-7",
    baseVersion: 12,
    payload: { topic: "progressive-enhancement-system", action: "capability-gated experience runtime" },
    createdAtMs: Date.now() - 1_200,
    idempotencyKey: "progressive-enhancement-system:doc-7:12",
    dependencies: [],
  });
  const drained = outbox.acknowledge("progressive-enhancement-system:doc-7:12");
  return { operation, drained };
}
