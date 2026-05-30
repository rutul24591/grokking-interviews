export interface DebugEvent {
  topic: string;
  operationId: string;
  phase: "accepted" | "rejected" | "effect-started" | "effect-settled" | "disposed";
  reason?: string;
  at: number;
}

export class RuntimeDiagnostics {
  private events: DebugEvent[] = [];
  private counters = new Map<string, number>();
  private openOperations = new Map<string, number>();

  record(event: DebugEvent): void {
    this.events.push(event);
    const key = event.reason ? `${event.phase}:${event.reason}` : event.phase;
    this.counters.set(key, (this.counters.get(key) ?? 0) + 1);
    if (event.phase === "accepted" || event.phase === "effect-started") this.openOperations.set(event.operationId, event.at);
    if (event.phase === "effect-settled" || event.phase === "disposed" || event.phase === "rejected") this.openOperations.delete(event.operationId);
    if (this.events.length > 200) this.events.shift();
  }

  explain(operationId: string): string[] {
    return this.events
      .filter((event) => event.operationId === operationId)
      .map((event) => `${event.phase}@${event.at}${event.reason ? `:${event.reason}` : ""}`);
  }

  summary(): Record<string, number> {
    return Object.fromEntries(this.counters.entries());
  }

  hasRegressionSignal(): boolean {
    const rejected = [...this.counters.entries()].filter(([key]) => key.startsWith("rejected")).reduce((sum, [, count]) => sum + count, 0);
    const settled = this.counters.get("effect-settled") ?? 0;
    return rejected > 5 || settled > 100 || this.openOperations.size > 20;
  }

  stuckOperations(now: number, timeoutMs: number): string[] {
    return [...this.openOperations.entries()]
      .filter(([, startedAt]) => now - startedAt > timeoutMs)
      .map(([operationId]) => operationId);
  }

  latestFailureReason(): string | undefined {
    for (let i = this.events.length - 1; i >= 0; i -= 1) {
      const event = this.events[i];
      if (event.phase === "rejected" || event.reason) return event.reason ?? event.phase;
    }
    return undefined;
  }
}

export function createOperationId(scope: string, version: number): string {
  return `${scope}:${version}:${Date.now()}`;
}

export function recordFiniteStateMachinesFailure(diagnostics: RuntimeDiagnostics, operationId: string, reason: string): void {
  diagnostics.record({
    topic: "finite-state-machines",
    operationId,
    phase: "rejected",
    reason,
    at: Date.now(),
  });
}
