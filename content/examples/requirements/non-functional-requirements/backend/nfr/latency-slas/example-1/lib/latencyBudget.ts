import { setTimeout as delay } from "node:timers/promises";

export type StepTiming = { step: string; ms: number; skipped?: boolean };

export class LatencyBudget {
  private readonly startedAt = Date.now();
  private timings: StepTiming[] = [];

  constructor(private readonly slaMs: number) {}

  elapsedMs() {
    return Date.now() - this.startedAt;
  }

  remainingMs() {
    return Math.max(0, this.slaMs - this.elapsedMs());
  }

  canSpend(estimatedMs: number) {
    return this.remainingMs() >= estimatedMs;
  }

  async time<T>(step: string, fn: () => Promise<T>, opts?: { estimateMs?: number }) {
    if (opts?.estimateMs != null && !this.canSpend(opts.estimateMs)) {
      this.timings.push({ step, ms: 0, skipped: true });
      return { skipped: true as const, value: null as any };
    }
    const s = Date.now();
    const value = await fn();
    this.timings.push({ step, ms: Date.now() - s });
    return { skipped: false as const, value };
  }

  async sleep(step: string, ms: number) {
    const s = Date.now();
    await delay(ms);
    this.timings.push({ step, ms: Date.now() - s });
  }

  report() {
    const elapsed = this.elapsedMs();
    return {
      slaMs: this.slaMs,
      elapsedMs: elapsed,
      withinSla: elapsed <= this.slaMs,
      timings: this.timings
    };
  }
}

