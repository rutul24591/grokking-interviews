import { RecentLatencies } from "@/lib/stats";

export type RejectReason =
  | "tenant_not_found"
  | "missing_tenant"
  | "rate_limited"
  | "concurrency_rejected"
  | "budget_exhausted"
  | "server_error";

type Counters = {
  total: number;
  ok: number;
  errors: number;
  rejected: Record<string, number>;
};

type TenantTelemetry = {
  counters: Counters;
  latencies: RecentLatencies;
  spentUnits: number;
  dailyUnitBudget: number;
};

type TelemetryState = {
  tenants: Map<string, TenantTelemetry>;
  updatedAt: string;
};

declare global {
  // eslint-disable-next-line no-var
  var __tenantLabTelemetry: TelemetryState | undefined;
}

function createTenantTelemetry(dailyUnitBudget: number): TenantTelemetry {
  return {
    counters: { total: 0, ok: 0, errors: 0, rejected: {} },
    latencies: new RecentLatencies(6000),
    spentUnits: 0,
    dailyUnitBudget,
  };
}

function getState(): TelemetryState {
  if (!globalThis.__tenantLabTelemetry) {
    globalThis.__tenantLabTelemetry = { tenants: new Map(), updatedAt: new Date().toISOString() };
  }
  return globalThis.__tenantLabTelemetry;
}

function getTenant(state: TelemetryState, tenantId: string, dailyUnitBudget: number) {
  const existing = state.tenants.get(tenantId);
  if (existing) {
    existing.dailyUnitBudget = dailyUnitBudget;
    return existing;
  }
  const t = createTenantTelemetry(dailyUnitBudget);
  state.tenants.set(tenantId, t);
  return t;
}

export function recordRequest(params: {
  tenantId: string;
  dailyUnitBudget: number;
  latencyMs: number;
  ok: boolean;
  rejectReason?: RejectReason;
  unitsCharged?: number;
}) {
  const state = getState();
  const t = getTenant(state, params.tenantId, params.dailyUnitBudget);
  t.counters.total += 1;

  if (params.rejectReason) {
    t.counters.rejected[params.rejectReason] =
      (t.counters.rejected[params.rejectReason] ?? 0) + 1;
  }

  if (params.ok) t.counters.ok += 1;
  else t.counters.errors += 1;

  if (params.unitsCharged) t.spentUnits += params.unitsCharged;

  t.latencies.push(params.latencyMs);
  state.updatedAt = new Date().toISOString();
}

export function snapshotTenant(tenantId: string) {
  const state = getState();
  const t = state.tenants.get(tenantId);
  if (!t) {
    return {
      total: 0,
      ok: 0,
      errors: 0,
      rejected: {},
      errorRate: 0,
      latencyMs: { p50: 0, p95: 0, max: 0 },
      budget: { spentUnits: 0, dailyUnitBudget: 0, remainingUnits: 0 },
      updatedAt: state.updatedAt,
    };
  }
  const c = t.counters;
  const latency = t.latencies.snapshot();
  const errorRate = c.total === 0 ? 0 : c.errors / c.total;
  const remaining = Math.max(0, t.dailyUnitBudget - t.spentUnits);
  return {
    total: c.total,
    ok: c.ok,
    errors: c.errors,
    rejected: c.rejected,
    errorRate,
    latencyMs: { p50: latency.p50, p95: latency.p95, max: latency.max },
    budget: { spentUnits: t.spentUnits, dailyUnitBudget: t.dailyUnitBudget, remainingUnits: remaining },
    updatedAt: state.updatedAt,
  };
}

export function resetTelemetry() {
  globalThis.__tenantLabTelemetry = { tenants: new Map(), updatedAt: new Date().toISOString() };
}

