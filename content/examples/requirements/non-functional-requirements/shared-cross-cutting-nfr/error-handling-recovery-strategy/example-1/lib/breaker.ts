export type BreakerState = "closed" | "open" | "half_open";

export class CircuitBreaker {
  private state: BreakerState = "closed";
  private failures = 0;
  private openedAt = 0;

  constructor(
    private readonly opts: {
      failureThreshold: number;
      openForMs: number;
      halfOpenMaxCalls: number;
    },
  ) {}

  snapshot() {
    return { state: this.state, failures: this.failures, openedAt: this.openedAt };
  }

  canAttempt(now = Date.now()): boolean {
    if (this.state === "closed") return true;
    if (this.state === "open") {
      if (now - this.openedAt >= this.opts.openForMs) {
        this.state = "half_open";
        this.failures = 0;
        return true;
      }
      return false;
    }
    // half-open
    return this.failures < this.opts.halfOpenMaxCalls;
  }

  onSuccess() {
    this.state = "closed";
    this.failures = 0;
    this.openedAt = 0;
  }

  onFailure(now = Date.now()) {
    this.failures += 1;
    if (this.state === "half_open") {
      this.state = "open";
      this.openedAt = now;
      return;
    }
    if (this.failures >= this.opts.failureThreshold) {
      this.state = "open";
      this.openedAt = now;
    }
  }
}

