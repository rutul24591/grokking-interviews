import { NextResponse } from "next/server";
import { getConfig } from "@/lib/store";
import { stableUniform01 } from "@/lib/random";
import { getRuntime } from "@/lib/runtime";
import { recordRequest, snapshotTenant } from "@/lib/telemetry";

function sleep(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

export async function GET(req: Request) {
  const started = Date.now();
  const config = await getConfig();

  const tenantId = req.headers.get("x-tenant-id");
  const requestId = req.headers.get("x-request-id") ?? crypto.randomUUID();
  const url = new URL(req.url);
  const units = Math.max(1, Math.min(100, Number(url.searchParams.get("units") ?? "1")));

  if (!tenantId) {
    const latencyMs = Date.now() - started;
    recordRequest({
      tenantId: "unknown",
      dailyUnitBudget: 0,
      latencyMs,
      ok: false,
      rejectReason: "missing_tenant",
    });
    return NextResponse.json({ error: "missing_tenant" }, { status: 400 });
  }

  const tenant = config.tenants[tenantId];
  if (!tenant) {
    const latencyMs = Date.now() - started;
    recordRequest({
      tenantId,
      dailyUnitBudget: 0,
      latencyMs,
      ok: false,
      rejectReason: "tenant_not_found",
    });
    return NextResponse.json({ error: "tenant_not_found" }, { status: 404 });
  }

  const rt = getRuntime(config);
  const tenantRt = rt.tenant(tenant);

  // Rate limit first: cheap rejection.
  if (!tenantRt.rps.take(1)) {
    const latencyMs = Date.now() - started;
    recordRequest({
      tenantId,
      dailyUnitBudget: tenant.dailyUnitBudget,
      latencyMs,
      ok: false,
      rejectReason: "rate_limited",
    });
    return NextResponse.json({ error: "rate_limited" }, { status: 429, headers: { "Retry-After": "1" } });
  }

  // Budget check (simple in-memory accounting). For demo purposes, budget is charged only on success.
  const snap = snapshotTenant(tenantId);
  if (snap.budget.remainingUnits < units) {
    const latencyMs = Date.now() - started;
    recordRequest({
      tenantId,
      dailyUnitBudget: tenant.dailyUnitBudget,
      latencyMs,
      ok: false,
      rejectReason: "budget_exhausted",
    });
    return NextResponse.json({ error: "budget_exhausted" }, { status: 429 });
  }

  // Concurrency: shared mode uses global-only (noisy neighbor). Bulkhead uses both global + per-tenant.
  const acquiredGlobal = rt.global.tryAcquire();
  if (!acquiredGlobal) {
    const latencyMs = Date.now() - started;
    recordRequest({
      tenantId,
      dailyUnitBudget: tenant.dailyUnitBudget,
      latencyMs,
      ok: false,
      rejectReason: "concurrency_rejected",
    });
    return NextResponse.json({ error: "busy_global" }, { status: 503 });
  }

  const acquiredTenant = config.mode === "bulkhead" ? tenantRt.concurrency.tryAcquire() : true;
  if (!acquiredTenant) {
    rt.global.release();
    const latencyMs = Date.now() - started;
    recordRequest({
      tenantId,
      dailyUnitBudget: tenant.dailyUnitBudget,
      latencyMs,
      ok: false,
      rejectReason: "concurrency_rejected",
    });
    return NextResponse.json({ error: "busy_tenant" }, { status: 503 });
  }

  let status = 200;
  let ok = true;
  let simulatedLatencyMs = 0;

  try {
    const u = (tag: string) => stableUniform01(`${tenantId}:${requestId}:${tag}`);
    const isError = u("err") < tenant.behavior.errorRate;
    const isTail = u("tail") < tenant.behavior.tailPct;
    const jitter = Math.floor(u("j") * tenant.behavior.jitterMs);
    const tail = isTail ? Math.floor(u("t") * tenant.behavior.tailLatencyMs) : 0;
    simulatedLatencyMs = tenant.behavior.baseLatencyMs + jitter + tail + Math.floor(units * 2);

    await sleep(simulatedLatencyMs);
    if (isError) {
      status = tenant.behavior.errorStatus;
      ok = false;
    }
  } catch {
    status = 500;
    ok = false;
  } finally {
    if (config.mode === "bulkhead") tenantRt.concurrency.release();
    rt.global.release();
  }

  const latencyMs = Date.now() - started;
  recordRequest({
    tenantId,
    dailyUnitBudget: tenant.dailyUnitBudget,
    latencyMs,
    ok: ok && status < 400,
    unitsCharged: ok ? units : 0,
  });

  return NextResponse.json(
    {
      tenantId,
      requestId,
      ok,
      status,
      mode: config.mode,
      units,
      latencyMs,
      simulatedLatencyMs,
      ts: new Date().toISOString(),
    },
    { status, headers: { "Cache-Control": "no-store" } },
  );
}
