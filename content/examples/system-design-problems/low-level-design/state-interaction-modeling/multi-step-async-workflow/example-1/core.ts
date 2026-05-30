type Status = "idle" | "pending" | "success" | "error" | "cancelled" | "stale";

export interface RuntimeSnapshot<T> {
  status: Status;
  version: number;
  data?: T;
  error?: string;
  activeOperationId?: string;
}

export class GuardedRuntime<T> {
  private snapshot: RuntimeSnapshot<T> = { status: "idle", version: 0 };
  private listeners = new Set<(snapshot: RuntimeSnapshot<T>) => void>();

  getSnapshot(): RuntimeSnapshot<T> {
    return { ...this.snapshot };
  }

  subscribe(listener: (snapshot: RuntimeSnapshot<T>) => void): () => void {
    this.listeners.add(listener);
    listener(this.getSnapshot());
    return () => this.listeners.delete(listener);
  }

  start(operationId: string): RuntimeSnapshot<T> {
    this.snapshot = {
      status: "pending",
      version: this.snapshot.version + 1,
      activeOperationId: operationId,
      data: this.snapshot.data,
    };
    this.emit();
    return this.getSnapshot();
  }

  settle(operationId: string, result: { ok: true; data: T } | { ok: false; error: string }): RuntimeSnapshot<T> {
    if (this.snapshot.activeOperationId !== operationId) {
      this.snapshot = { ...this.snapshot, status: "stale", version: this.snapshot.version + 1 };
      this.emit();
      return this.getSnapshot();
    }
    this.snapshot =
      result.ok
        ? { status: "success", version: this.snapshot.version + 1, data: result.data }
        : { status: "error", version: this.snapshot.version + 1, error: result.error };
    this.emit();
    return this.getSnapshot();
  }

  cancel(operationId: string): boolean {
    if (this.snapshot.activeOperationId !== operationId) return false;
    this.snapshot = { status: "cancelled", version: this.snapshot.version + 1, data: this.snapshot.data };
    this.emit();
    return true;
  }

  private emit(): void {
    const snapshot = this.getSnapshot();
    for (const listener of this.listeners) listener(snapshot);
  }
}
