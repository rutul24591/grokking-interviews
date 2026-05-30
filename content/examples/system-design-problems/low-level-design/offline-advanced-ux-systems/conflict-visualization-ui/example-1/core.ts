export type ConflictVisualizationUiStatus = "accepted" | "queued" | "blocked" | "conflicted" | "drained";

export interface ConflictVisualizationUiOperation {
  id: string;
  actorId: string;
  resourceId: string;
  baseVersion: number;
  payload: Record<string, unknown>;
  createdAtMs: number;
  idempotencyKey: string;
  dependencies: string[];
}

export interface ConflictVisualizationUiSnapshot {
  status: ConflictVisualizationUiStatus;
  queueDepth: number;
  oldestPendingAgeMs: number;
  pending: ConflictVisualizationUiOperation[];
  evidence: string[];
}

export class ConflictVisualizationUiOutbox {
  private pending: ConflictVisualizationUiOperation[] = [];
  private acknowledged = new Set<string>();
  private blockedReasons: string[] = [];

  enqueue(operation: ConflictVisualizationUiOperation): ConflictVisualizationUiSnapshot {
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

  acknowledge(idempotencyKey: string): ConflictVisualizationUiSnapshot {
    this.acknowledged.add(idempotencyKey);
    this.pending = this.pending.filter((operation) => operation.idempotencyKey !== idempotencyKey);
    return this.snapshot(this.pending.length === 0 ? "drained" : "queued", ["server-ack-persisted"]);
  }

  nextReady(): ConflictVisualizationUiOperation | undefined {
    const completed = new Set(this.acknowledged);
    return this.pending.find((operation) => operation.dependencies.every((dependency) => completed.has(dependency)));
  }

  markConflict(operationId: string, reason: string): ConflictVisualizationUiSnapshot {
    this.blockedReasons.push(`${operationId}:${reason}`);
    return this.snapshot("conflicted", this.blockedReasons);
  }

  private snapshot(status: ConflictVisualizationUiStatus, evidence: string[]): ConflictVisualizationUiSnapshot {
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

export function runConflictVisualizationUiOutboxScenario() {
  const outbox = new ConflictVisualizationUiOutbox();
  const operation = outbox.enqueue({
    id: "conflict-visualization-ui-op-1",
    actorId: "user-42",
    resourceId: "doc-7",
    baseVersion: 12,
    payload: { topic: "conflict-visualization-ui", action: "merge review and resolution interface" },
    createdAtMs: Date.now() - 1_200,
    idempotencyKey: "conflict-visualization-ui:doc-7:12",
    dependencies: [],
  });
  const drained = outbox.acknowledge("conflict-visualization-ui:doc-7:12");
  return { operation, drained };
}
