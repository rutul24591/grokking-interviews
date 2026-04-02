type State = "CLOSED" | "OPEN" | "HALF_OPEN";

class CircuitBreaker {
  state: State = "CLOSED";
  failures = 0;
  openedAtMs = 0;

  constructor(
    private readonly opts: { failureThreshold: number; openMs: number },
  ) {}

  canTry(nowMs: number) {
    if (this.state === "CLOSED") return true;
    if (this.state === "OPEN" && nowMs - this.openedAtMs >= this.opts.openMs) {
      this.state = "HALF_OPEN";
      return true;
    }
    return this.state === "HALF_OPEN";
  }

  onSuccess() {
    this.failures = 0;
    this.state = "CLOSED";
  }

  onFailure(nowMs: number) {
    this.failures++;
    if (this.failures >= this.opts.failureThreshold) {
      this.state = "OPEN";
      this.openedAtMs = nowMs;
    }
  }
}

function assert(cond: unknown, msg: string) {
  if (!cond) throw new Error(msg);
}

const cb = new CircuitBreaker({ failureThreshold: 2, openMs: 100 });
assert(cb.canTry(0), "can try");
cb.onFailure(0);
cb.onFailure(1);
assert(cb.state === "OPEN", "opened");
assert(!cb.canTry(50), "still open");
assert(cb.canTry(150), "half-open after openMs");
cb.onSuccess();
assert(cb.state === "CLOSED", "closed after success");

console.log(JSON.stringify({ ok: true }, null, 2));

