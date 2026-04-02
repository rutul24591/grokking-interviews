import { Semaphore, TokenBucket } from "@/lib/limiters";
import type { Config, TenantConfig } from "@/lib/store";

type TenantRuntime = {
  concurrency: Semaphore;
  rps: TokenBucket;
};

type RuntimeState = {
  global: Semaphore;
  tenants: Map<string, TenantRuntime>;
  lastConfigHash: string;
};

declare global {
  // eslint-disable-next-line no-var
  var __tenantLabRuntime: RuntimeState | undefined;
}

function hashConfig(config: Config) {
  // Good enough for demo: stable stringify.
  return JSON.stringify({
    mode: config.mode,
    globalMaxConcurrent: config.globalMaxConcurrent,
    tenants: Object.fromEntries(
      Object.values(config.tenants)
        .sort((a, b) => a.id.localeCompare(b.id))
        .map((t) => [
          t.id,
          { maxRps: t.maxRps, maxConcurrent: t.maxConcurrent },
        ]),
    ),
  });
}

function ensureTenant(state: RuntimeState, tenant: TenantConfig) {
  const existing = state.tenants.get(tenant.id);
  if (existing) return existing;
  const rt: TenantRuntime = {
    concurrency: new Semaphore(tenant.maxConcurrent),
    rps: new TokenBucket({ capacity: tenant.maxRps, refillPerSec: tenant.maxRps }),
  };
  state.tenants.set(tenant.id, rt);
  return rt;
}

export function getRuntime(config: Config) {
  const h = hashConfig(config);
  if (!globalThis.__tenantLabRuntime || globalThis.__tenantLabRuntime.lastConfigHash !== h) {
    globalThis.__tenantLabRuntime = {
      global: new Semaphore(config.globalMaxConcurrent),
      tenants: new Map(),
      lastConfigHash: h,
    };
  }
  const state = globalThis.__tenantLabRuntime;
  return {
    state,
    global: state.global,
    tenant: (tenant: TenantConfig) => ensureTenant(state, tenant),
  };
}

