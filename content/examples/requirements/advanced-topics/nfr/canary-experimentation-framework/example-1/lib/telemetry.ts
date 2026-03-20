import { RecentLatencies } from "@/lib/stats";
import type { Variant } from "@/lib/bucketing";

type Counters = {
  total: number;
  ok: number;
  errors: number;
};

type TelemetryState = {
  counters: Record<Variant, Counters>;
  latencies: Record<Variant, RecentLatencies>;
  updatedAt: string;
};

declare global {
  // eslint-disable-next-line no-var
  var __canaryLabTelemetry: TelemetryState | undefined;
}

function createState(): TelemetryState {
  return {
    counters: {
      baseline: { total: 0, ok: 0, errors: 0 },
      canary: { total: 0, ok: 0, errors: 0 },
    },
    latencies: {
      baseline: new RecentLatencies(4000),
      canary: new RecentLatencies(4000),
    },
    updatedAt: new Date().toISOString(),
  };
}

function getState(): TelemetryState {
  if (!globalThis.__canaryLabTelemetry) globalThis.__canaryLabTelemetry = createState();
  return globalThis.__canaryLabTelemetry;
}

export function recordEvent(params: { variant: Variant; ok: boolean; latencyMs: number }) {
  const state = getState();
  const c = state.counters[params.variant];
  c.total += 1;
  if (params.ok) c.ok += 1;
  else c.errors += 1;
  state.latencies[params.variant].push(params.latencyMs);
  state.updatedAt = new Date().toISOString();
}

export function snapshotVariant(variant: Variant) {
  const state = getState();
  const c = state.counters[variant];
  const latency = state.latencies[variant].snapshot();
  const errorRate = c.total === 0 ? 0 : c.errors / c.total;
  return {
    total: c.total,
    ok: c.ok,
    errors: c.errors,
    errorRate,
    latencyMs: { p50: latency.p50, p95: latency.p95, max: latency.max },
    updatedAt: state.updatedAt,
  };
}

export function resetTelemetry() {
  globalThis.__canaryLabTelemetry = createState();
}

