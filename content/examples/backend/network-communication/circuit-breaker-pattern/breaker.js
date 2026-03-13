export class CircuitBreaker {
  constructor(options) {
    this.failureThreshold = options.failureThreshold;
    this.resetTimeoutMs = options.resetTimeoutMs;
    this.state = "closed";
    this.failures = 0;
    this.lastOpened = 0;
  }

  canRequest() {
    if (this.state === "open") {
      const now = Date.now();
      if (now - this.lastOpened > this.resetTimeoutMs) {
        this.state = "half-open";
        return true;
      }
      return false;
    }
    return true;
  }

  success() {
    this.failures = 0;
    if (this.state === "half-open") this.state = "closed";
  }

  failure() {
    this.failures += 1;
    if (this.failures >= this.failureThreshold) {
      this.state = "open";
      this.lastOpened = Date.now();
    }
  }
}