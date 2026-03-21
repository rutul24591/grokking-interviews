"use client";

import { useEffect, useMemo, useState } from "react";

type TenantPlan = "free" | "pro" | "enterprise";
type IsolationMode = "shared" | "bulkhead";

type TenantConfig = {
  id: string;
  name: string;
  plan: TenantPlan;
  maxRps: number;
  maxConcurrent: number;
  dailyUnitBudget: number;
  behavior: {
    baseLatencyMs: number;
    jitterMs: number;
    tailPct: number;
    tailLatencyMs: number;
    errorRate: number;
    errorStatus: number;
  };
};

type Config = {
  mode: IsolationMode;
  globalMaxConcurrent: number;
  tenants: Record<string, TenantConfig>;
};

type TenantReport = {
  total: number;
  ok: number;
  errors: number;
  rejected: Record<string, number>;
  errorRate: number;
  latencyMs: { p50: number; p95: number; max: number };
  budget: { spentUnits: number; dailyUnitBudget: number; remainingUnits: number };
  updatedAt: string;
};

type Report = {
  now: string;
  config: Config;
  tenants: Record<string, TenantReport>;
  global: {
    inFlight: number;
    maxConcurrent: number;
  };
};

async function json<T>(input: RequestInfo | URL, init?: RequestInit): Promise<T> {
  const res = await fetch(input, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
    cache: "no-store",
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}: ${text}`);
  return JSON.parse(text) as T;
}

function pct(v: number) {
  return `${(v * 100).toFixed(2)}%`;
}

function TenantRow(props: {
  id: string;
  report?: TenantReport;
  onBurst: () => void;
}) {
  const r = props.report;
  const rejectedKeys = r ? Object.keys(r.rejected).sort() : [];
  return (
    <div className="rounded-lg border border-slate-700 bg-slate-950 p-4">
      <div className="flex items-center justify-between">
        <div className="font-semibold text-slate-100">{props.id}</div>
        <button
          className="rounded bg-slate-800 px-3 py-1 text-xs font-semibold hover:bg-slate-700"
          onClick={props.onBurst}
        >
          Burst
        </button>
      </div>
      {r ? (
        <div className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
          <div className="flex justify-between"><span className="text-slate-300">requests</span><span>{r.total}</span></div>
          <div className="flex justify-between"><span className="text-slate-300">error rate</span><span>{pct(r.errorRate)}</span></div>
          <div className="flex justify-between"><span className="text-slate-300">p95</span><span>{r.latencyMs.p95.toFixed(0)}ms</span></div>
          <div className="flex justify-between"><span className="text-slate-300">budget</span><span>{r.budget.remainingUnits}/{r.budget.dailyUnitBudget}</span></div>
          {rejectedKeys.length ? (
            <div className="sm:col-span-2 text-xs text-slate-300">
              rejected:{" "}
              <span className="font-mono text-[11px] text-slate-200">
                {rejectedKeys.map((k) => `${k}=${r.rejected[k]}`).join(", ")}
              </span>
            </div>
          ) : null}
        </div>
      ) : (
        <div className="mt-2 text-sm text-slate-300">No traffic yet.</div>
      )}
    </div>
  );
}

export default function Page() {
  const [config, setConfig] = useState<Config | null>(null);
  const [report, setReport] = useState<Report | null>(null);
  const [error, setError] = useState<string>("");

  const [mode, setMode] = useState<IsolationMode>("bulkhead");
  const [globalMaxConcurrent, setGlobalMaxConcurrent] = useState(80);

  async function refresh() {
    try {
      const [cfg, rep] = await Promise.all([
        json<Config>("/api/config"),
        json<Report>("/api/report"),
      ]);
      setConfig(cfg);
      setReport(rep);
      setError("");
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  useEffect(() => {
    refresh();
    const t = setInterval(refresh, 1500);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (!config) return;
    setMode(config.mode);
    setGlobalMaxConcurrent(config.globalMaxConcurrent);
  }, [config]);

  async function saveMode() {
    await json("/api/config", {
      method: "POST",
      body: JSON.stringify({ mode, globalMaxConcurrent }),
    });
    await refresh();
  }

  async function reset() {
    await json("/api/reset", { method: "POST" });
    await refresh();
  }

  async function burst(tenantId: string) {
    const reqs = Array.from({ length: 250 }, () =>
      fetch("/api/work?units=1", {
        headers: { "x-tenant-id": tenantId, "x-request-id": crypto.randomUUID() },
        cache: "no-store",
      }).catch(() => null),
    );
    await Promise.all(reqs);
    await refresh();
  }

  const tenantIds = useMemo(() => Object.keys(config?.tenants ?? {}).sort(), [config?.tenants]);

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <header className="mb-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Tenant Lab</h1>
            <p className="mt-2 text-slate-300">
              Multi-tenant isolation: shared pool vs bulkheads + per-tenant quotas.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              className="rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-semibold hover:bg-slate-800"
              onClick={reset}
            >
              Reset
            </button>
          </div>
        </div>
        {error ? (
          <div className="mt-4 rounded border border-red-500/40 bg-red-500/10 p-3 text-sm">
            {error}
          </div>
        ) : null}
      </header>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-700 bg-slate-900/50 p-5">
          <h2 className="text-lg font-semibold">Isolation Mode</h2>
          <p className="mt-2 text-sm text-slate-300">
            Shared pool maximizes utilization but can cause noisy-neighbor incidents. Bulkheads reserve per-tenant concurrency.
          </p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className="grid gap-1 text-sm">
              <span className="text-slate-300">Mode</span>
              <select
                className="rounded border border-slate-700 bg-slate-950 px-3 py-2"
                value={mode}
                onChange={(e) => setMode(e.target.value as IsolationMode)}
              >
                <option value="shared">shared</option>
                <option value="bulkhead">bulkhead</option>
              </select>
            </label>
            <label className="grid gap-1 text-sm">
              <span className="text-slate-300">Global max concurrent</span>
              <input
                type="number"
                className="rounded border border-slate-700 bg-slate-950 px-3 py-2"
                value={globalMaxConcurrent}
                onChange={(e) => setGlobalMaxConcurrent(Number(e.target.value))}
              />
            </label>
          </div>
          <button
            className="mt-5 rounded-lg bg-indigo-500 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-400"
            onClick={saveMode}
          >
            Save
          </button>
          {report ? (
            <div className="mt-4 rounded border border-slate-700 bg-slate-950 p-3 text-xs text-slate-200">
              global inFlight:{" "}
              <span className="font-mono text-slate-100">
                {report.global.inFlight}/{report.global.maxConcurrent}
              </span>
            </div>
          ) : null}
        </div>

        <div className="rounded-xl border border-slate-700 bg-slate-900/50 p-5">
          <h2 className="text-lg font-semibold">Tenants</h2>
          <p className="mt-2 text-sm text-slate-300">
            Use “Burst” to generate load per tenant. Run the agent for a repeatable noisy-neighbor scenario.
          </p>
          <div className="mt-4 grid gap-4">
            {tenantIds.map((id) => (
              <TenantRow
                key={id}
                id={id}
                report={report?.tenants?.[id]}
                onBurst={() => burst(id)}
              />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

