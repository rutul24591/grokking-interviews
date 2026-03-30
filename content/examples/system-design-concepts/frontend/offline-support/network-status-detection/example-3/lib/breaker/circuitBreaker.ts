export type BreakerState = "closed" | "open" | "half_open";

export type BreakerSnapshot = {
  state: BreakerState;
  consecutiveFailures: number;
  openUntil: number;
};

class CircuitOpenError extends Error {
  constructor() {
    super("circuit-open");
    this.name = "CircuitOpenError";
  }
}

export function createCircuitBreaker(params: { failureThreshold: number; openMs: number }) {
  let state: BreakerState = "closed";
  let consecutiveFailures = 0;
  let openUntil = 0;
  let halfOpenInFlight = false;

  function snapshot(): BreakerSnapshot {
    return { state, consecutiveFailures, openUntil };
  }

  function transitionToOpen() {
    state = "open";
    openUntil = Date.now() + params.openMs;
    halfOpenInFlight = false;
  }

  function transitionToHalfOpenIfReady() {
    if (state !== "open") return;
    if (Date.now() < openUntil) return;
    state = "half_open";
    halfOpenInFlight = false;
  }

  async function exec<T>(fn: () => Promise<T>): Promise<T> {
    transitionToHalfOpenIfReady();

    if (state === "open") throw new CircuitOpenError();
    if (state === "half_open") {
      if (halfOpenInFlight) throw new CircuitOpenError();
      halfOpenInFlight = true;
    }

    try {
      const out = await fn();
      consecutiveFailures = 0;
      if (state === "half_open") state = "closed";
      return out;
    } catch (e) {
      consecutiveFailures += 1;
      if (state === "half_open") {
        transitionToOpen();
      } else if (consecutiveFailures >= params.failureThreshold) {
        transitionToOpen();
      }
      throw e;
    } finally {
      halfOpenInFlight = false;
    }
  }

  return { exec, snapshot };
}

