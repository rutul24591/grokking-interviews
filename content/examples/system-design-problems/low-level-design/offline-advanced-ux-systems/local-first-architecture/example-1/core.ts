export type LocalFirstArchitectureStatus = "accepted" | "queued" | "blocked" | "conflicted" | "drained";

export interface LocalFirstArchitectureOperation {
  id: string;
  actorId: string;
  resourceId: string;
  baseVersion: number;
  payload: Record<string, unknown>;
  createdAtMs: number;
  idempotencyKey: string;
  dependencies: string[];
}

export interface LocalFirstArchitectureSnapshot {
  status: LocalFirstArchitectureStatus;
  queueDepth: number;
  oldestPendingAgeMs: number;
  pending: LocalFirstArchitectureOperation[];
  evidence: string[];
}

export class LocalFirstArchitectureOutbox {
  private pending: LocalFirstArchitectureOperation[] = [];
  private acknowledged = new Set<string>();
  private blockedReasons: string[] = [];

  enqueue(operation: LocalFirstArchitectureOperation): LocalFirstArchitectureSnapshot {
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

  acknowledge(idempotencyKey: string): LocalFirstArchitectureSnapshot {
    this.acknowledged.add(idempotencyKey);
    this.pending = this.pending.filter((operation) => operation.idempotencyKey !== idempotencyKey);
    return this.snapshot(this.pending.length === 0 ? "drained" : "queued", ["server-ack-persisted"]);
  }

  nextReady(): LocalFirstArchitectureOperation | undefined {
    const completed = new Set(this.acknowledged);
    return this.pending.find((operation) => operation.dependencies.every((dependency) => completed.has(dependency)));
  }

  markConflict(operationId: string, reason: string): LocalFirstArchitectureSnapshot {
    this.blockedReasons.push(`${operationId}:${reason}`);
    return this.snapshot("conflicted", this.blockedReasons);
  }

  private snapshot(status: LocalFirstArchitectureStatus, evidence: string[]): LocalFirstArchitectureSnapshot {
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

export function runLocalFirstArchitectureOutboxScenario() {
  const outbox = new LocalFirstArchitectureOutbox();
  const operation = outbox.enqueue({
    id: "local-first-architecture-op-1",
    actorId: "user-42",
    resourceId: "doc-7",
    baseVersion: 12,
    payload: { topic: "local-first-architecture", action: "local authoritative client runtime" },
    createdAtMs: Date.now() - 1_200,
    idempotencyKey: "local-first-architecture:doc-7:12",
    dependencies: [],
  });
  const drained = outbox.acknowledge("local-first-architecture:doc-7:12");
  return { operation, drained };
}
