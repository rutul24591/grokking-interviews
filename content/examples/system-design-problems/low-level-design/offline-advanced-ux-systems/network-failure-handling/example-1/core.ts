export type NetworkFailureHandlingStatus = "accepted" | "queued" | "blocked" | "conflicted" | "drained";

export interface NetworkFailureHandlingOperation {
  id: string;
  actorId: string;
  resourceId: string;
  baseVersion: number;
  payload: Record<string, unknown>;
  createdAtMs: number;
  idempotencyKey: string;
  dependencies: string[];
}

export interface NetworkFailureHandlingSnapshot {
  status: NetworkFailureHandlingStatus;
  queueDepth: number;
  oldestPendingAgeMs: number;
  pending: NetworkFailureHandlingOperation[];
  evidence: string[];
}

export class NetworkFailureHandlingOutbox {
  private pending: NetworkFailureHandlingOperation[] = [];
  private acknowledged = new Set<string>();
  private blockedReasons: string[] = [];

  enqueue(operation: NetworkFailureHandlingOperation): NetworkFailureHandlingSnapshot {
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

  acknowledge(idempotencyKey: string): NetworkFailureHandlingSnapshot {
    this.acknowledged.add(idempotencyKey);
    this.pending = this.pending.filter((operation) => operation.idempotencyKey !== idempotencyKey);
    return this.snapshot(this.pending.length === 0 ? "drained" : "queued", ["server-ack-persisted"]);
  }

  nextReady(): NetworkFailureHandlingOperation | undefined {
    const completed = new Set(this.acknowledged);
    return this.pending.find((operation) => operation.dependencies.every((dependency) => completed.has(dependency)));
  }

  markConflict(operationId: string, reason: string): NetworkFailureHandlingSnapshot {
    this.blockedReasons.push(`${operationId}:${reason}`);
    return this.snapshot("conflicted", this.blockedReasons);
  }

  private snapshot(status: NetworkFailureHandlingStatus, evidence: string[]): NetworkFailureHandlingSnapshot {
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

export function runNetworkFailureHandlingOutboxScenario() {
  const outbox = new NetworkFailureHandlingOutbox();
  const operation = outbox.enqueue({
    id: "network-failure-handling-op-1",
    actorId: "user-42",
    resourceId: "doc-7",
    baseVersion: 12,
    payload: { topic: "network-failure-handling", action: "connectivity and request health coordinator" },
    createdAtMs: Date.now() - 1_200,
    idempotencyKey: "network-failure-handling:doc-7:12",
    dependencies: [],
  });
  const drained = outbox.acknowledge("network-failure-handling:doc-7:12");
  return { operation, drained };
}
