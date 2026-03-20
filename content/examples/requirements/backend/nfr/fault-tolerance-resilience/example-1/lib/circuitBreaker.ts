type State = "CLOSED" | "OPEN" | "HALF_OPEN";

export class CircuitBreaker {
  private state: State = "CLOSED";
  private failures = 0;
  private openedAt = 0;

  constructor(
    private readonly failureThreshold: number,
    private readonly openForMs: number
  ) {}

  snapshot() {
    return { state: this.state, failures: this.failures };
  }

  private canAttempt(now: number) {
    if (this.state === "CLOSED") return true;
    if (this.state === "OPEN") {
      if (now - this.openedAt >= this.openForMs) {
        this.state = "HALF_OPEN";
        return true;
      }
      return false;
    }
    return true; // HALF_OPEN
  }

  async exec<T>(fn: () => Promise<T>): Promise<T> {
    const now = Date.now();
    if (!this.canAttempt(now)) throw new Error("breaker_open");

    try {
      const result = await fn();
      // Success closes the breaker.
      this.failures = 0;
      this.state = "CLOSED";
      return result;
    } catch (e) {
      this.failures++;
      if (this.failures >= this.failureThreshold) {
        this.state = "OPEN";
        this.openedAt = Date.now();
      } else if (this.state === "HALF_OPEN") {
        this.state = "OPEN";
        this.openedAt = Date.now();
      }
      throw e;
    }
  }
}

