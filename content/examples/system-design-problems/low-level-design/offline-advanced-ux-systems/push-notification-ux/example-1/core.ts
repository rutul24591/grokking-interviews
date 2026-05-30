export type PushNotificationUxStatus = "accepted" | "queued" | "blocked" | "conflicted" | "drained";

export interface PushNotificationUxOperation {
  id: string;
  actorId: string;
  resourceId: string;
  baseVersion: number;
  payload: Record<string, unknown>;
  createdAtMs: number;
  idempotencyKey: string;
  dependencies: string[];
}

export interface PushNotificationUxSnapshot {
  status: PushNotificationUxStatus;
  queueDepth: number;
  oldestPendingAgeMs: number;
  pending: PushNotificationUxOperation[];
  evidence: string[];
}

export class PushNotificationUxOutbox {
  private pending: PushNotificationUxOperation[] = [];
  private acknowledged = new Set<string>();
  private blockedReasons: string[] = [];

  enqueue(operation: PushNotificationUxOperation): PushNotificationUxSnapshot {
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

  acknowledge(idempotencyKey: string): PushNotificationUxSnapshot {
    this.acknowledged.add(idempotencyKey);
    this.pending = this.pending.filter((operation) => operation.idempotencyKey !== idempotencyKey);
    return this.snapshot(this.pending.length === 0 ? "drained" : "queued", ["server-ack-persisted"]);
  }

  nextReady(): PushNotificationUxOperation | undefined {
    const completed = new Set(this.acknowledged);
    return this.pending.find((operation) => operation.dependencies.every((dependency) => completed.has(dependency)));
  }

  markConflict(operationId: string, reason: string): PushNotificationUxSnapshot {
    this.blockedReasons.push(`${operationId}:${reason}`);
    return this.snapshot("conflicted", this.blockedReasons);
  }

  private snapshot(status: PushNotificationUxStatus, evidence: string[]): PushNotificationUxSnapshot {
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

export function runPushNotificationUxOutboxScenario() {
  const outbox = new PushNotificationUxOutbox();
  const operation = outbox.enqueue({
    id: "push-notification-ux-op-1",
    actorId: "user-42",
    resourceId: "doc-7",
    baseVersion: 12,
    payload: { topic: "push-notification-ux", action: "permission and notification preference coordinator" },
    createdAtMs: Date.now() - 1_200,
    idempotencyKey: "push-notification-ux:doc-7:12",
    dependencies: [],
  });
  const drained = outbox.acknowledge("push-notification-ux:doc-7:12");
  return { operation, drained };
}
