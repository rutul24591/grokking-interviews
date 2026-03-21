"use client";

import { useEffect, useMemo, useState } from "react";

type SloConfig = {
  objective: number;
  windowDays: number;
  latencyThresholdMs: number;
  badStatusFrom: number;
};

type BehaviorConfig = {
  baseLatencyMs: number;
  jitterMs: number;
  tailPct: number;
  tailLatencyMs: number;
  errorRate: number;
  errorStatus: number;
};

type ConfigResponse = {
  slo: SloConfig;
  behavior: BehaviorConfig;
};

type WindowReport = {
  windowLabel: string;
  windowMs: number;
  total: number;
  good: number;
  bad: number;
  goodRate: number;
  errorBudgetAllowedBad: number;
  burnRate: number;
};

type Alerts = {
  fast: { firing: boolean; threshold: number; windows: ["5m", "1h"] };
  slow: { firing: boolean; threshold: number; windows: ["30m", "6h"] };
  releaseFreeze: boolean;
};

type ReportResponse = {
  now: string;
  config: ConfigResponse;
  rollingBudget: {
    windowLabel: string;
    total: number;
    bad: number;
    allowedBad: number;
    remainingBad: number;
    remainingPct: number;
    consumedPct: number;
  };
  burn: WindowReport[];
  recent: { p50Ms: number; p95Ms: number; maxMs: number; sampleCount: number };
  alerts: Alerts;
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
  return `${(v * 100).toFixed(3)}%`;
}

export default function Page() {
  const [config, setConfig] = useState<ConfigResponse | null>(null);
  const [report, setReport] = useState<ReportResponse | null>(null);
  const [error, setError] = useState<string>("");

  const [objective, setObjective] = useState(0.999);
  const [windowDays, setWindowDays] = useState(30);
  const [latencyThresholdMs, setLatencyThresholdMs] = useState(200);
  const [badStatusFrom, setBadStatusFrom] = useState(500);

  const [baseLatencyMs, setBaseLatencyMs] = useState(80);
  const [jitterMs, setJitterMs] = useState(20);
  const [tailPct, setTailPct] = useState(0.05);
  const [tailLatencyMs, setTailLatencyMs] = useState(350);
  const [errorRate, setErrorRate] = useState(0.003);
  const [errorStatus, setErrorStatus] = useState(503);

  const releaseFreeze = report?.alerts.releaseFreeze ?? false;

  async function refreshAll() {
    try {
      const [cfg, rep] = await Promise.all([
        json<ConfigResponse>("/api/config"),
        json<ReportResponse>("/api/report"),
      ]);
      setConfig(cfg);
      setReport(rep);
      setError("");
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  useEffect(() => {
    refreshAll();
    const t = setInterval(refreshAll, 1500);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (!config) return;
    setObjective(config.slo.objective);
    setWindowDays(config.slo.windowDays);
    setLatencyThresholdMs(config.slo.latencyThresholdMs);
    setBadStatusFrom(config.slo.badStatusFrom);

    setBaseLatencyMs(config.behavior.baseLatencyMs);
    setJitterMs(config.behavior.jitterMs);
    setTailPct(config.behavior.tailPct);
    setTailLatencyMs(config.behavior.tailLatencyMs);
    setErrorRate(config.behavior.errorRate);
    setErrorStatus(config.behavior.errorStatus);
  }, [config]);

  async function saveConfig() {
    await json("/api/config", {
      method: "POST",
      body: JSON.stringify({
        slo: { objective, windowDays, latencyThresholdMs, badStatusFrom },
        behavior: {
          baseLatencyMs,
          jitterMs,
          tailPct,
          tailLatencyMs,
          errorRate,
          errorStatus,
        },
      }),
    });
    await refreshAll();
  }

  async function reset() {
    await json("/api/reset", { method: "POST" });
    await refreshAll();
  }

  async function generateBurst() {
    const reqs = Array.from({ length: 200 }, () =>
      fetch("/api/target", {
        headers: { "x-request-id": crypto.randomUUID() },
        cache: "no-store",
      }).catch(() => null),
    );
    await Promise.all(reqs);
    await refreshAll();
  }

  const burnRows = useMemo(() => report?.burn ?? [], [report?.burn]);

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <header className="mb-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold">SLO Lab</h1>
            <p className="mt-2 text-slate-300">
              Rolling error budget + burn-rate alerting, with a simulated target
              and an agent-driven incident.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              className="rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-semibold hover:bg-slate-800"
              onClick={generateBurst}
            >
              Generate burst
            </button>
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

        {releaseFreeze ? (
          <div className="mt-4 rounded border border-amber-500/40 bg-amber-500/10 p-3 text-sm">
            <div className="font-semibold text-amber-200">
              Release freeze recommended
            </div>
            <div className="text-slate-200">
              Burn-rate alert firing and/or error budget is low.
            </div>
          </div>
        ) : null}
      </header>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-700 bg-slate-900/50 p-5">
          <h2 className="text-lg font-semibold">SLO Config</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className="grid gap-1 text-sm">
              <span className="text-slate-300">Objective</span>
              <input
                type="number"
                step="0.0001"
                className="rounded border border-slate-700 bg-slate-950 px-3 py-2"
                value={objective}
                onChange={(e) => setObjective(Number(e.target.value))}
              />
            </label>
            <label className="grid gap-1 text-sm">
              <span className="text-slate-300">Window (days)</span>
              <input
                type="number"
                className="rounded border border-slate-700 bg-slate-950 px-3 py-2"
                value={windowDays}
                onChange={(e) => setWindowDays(Number(e.target.value))}
              />
            </label>
            <label className="grid gap-1 text-sm">
              <span className="text-slate-300">Latency threshold (ms)</span>
              <input
                type="number"
                className="rounded border border-slate-700 bg-slate-950 px-3 py-2"
                value={latencyThresholdMs}
                onChange={(e) => setLatencyThresholdMs(Number(e.target.value))}
              />
            </label>
            <label className="grid gap-1 text-sm">
              <span className="text-slate-300">Bad status from</span>
              <input
                type="number"
                className="rounded border border-slate-700 bg-slate-950 px-3 py-2"
                value={badStatusFrom}
                onChange={(e) => setBadStatusFrom(Number(e.target.value))}
              />
            </label>
          </div>

          <h3 className="mt-6 text-sm font-semibold text-slate-200">
            Target behavior (simulation)
          </h3>
          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            <label className="grid gap-1 text-sm">
              <span className="text-slate-300">Base latency (ms)</span>
              <input
                type="number"
                className="rounded border border-slate-700 bg-slate-950 px-3 py-2"
                value={baseLatencyMs}
                onChange={(e) => setBaseLatencyMs(Number(e.target.value))}
              />
            </label>
            <label className="grid gap-1 text-sm">
              <span className="text-slate-300">Jitter (ms)</span>
              <input
                type="number"
                className="rounded border border-slate-700 bg-slate-950 px-3 py-2"
                value={jitterMs}
                onChange={(e) => setJitterMs(Number(e.target.value))}
              />
            </label>
            <label className="grid gap-1 text-sm">
              <span className="text-slate-300">Tail %</span>
              <input
                type="number"
                step="0.01"
                className="rounded border border-slate-700 bg-slate-950 px-3 py-2"
                value={tailPct}
                onChange={(e) => setTailPct(Number(e.target.value))}
              />
            </label>
            <label className="grid gap-1 text-sm">
              <span className="text-slate-300">Tail latency (ms)</span>
              <input
                type="number"
                className="rounded border border-slate-700 bg-slate-950 px-3 py-2"
                value={tailLatencyMs}
                onChange={(e) => setTailLatencyMs(Number(e.target.value))}
              />
            </label>
            <label className="grid gap-1 text-sm">
              <span className="text-slate-300">Error rate</span>
              <input
                type="number"
                step="0.001"
                className="rounded border border-slate-700 bg-slate-950 px-3 py-2"
                value={errorRate}
                onChange={(e) => setErrorRate(Number(e.target.value))}
              />
            </label>
            <label className="grid gap-1 text-sm">
              <span className="text-slate-300">Error status</span>
              <input
                type="number"
                className="rounded border border-slate-700 bg-slate-950 px-3 py-2"
                value={errorStatus}
                onChange={(e) => setErrorStatus(Number(e.target.value))}
              />
            </label>
          </div>

          <button
            className="mt-5 rounded-lg bg-indigo-500 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-400"
            onClick={saveConfig}
          >
            Save config
          </button>
        </div>

        <div className="rounded-xl border border-slate-700 bg-slate-900/50 p-5">
          <h2 className="text-lg font-semibold">Rolling Budget</h2>
          {report ? (
            <div className="mt-4 grid gap-3 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-300">Window</span>
                <span>{report.rollingBudget.windowLabel}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-300">Total events</span>
                <span>{report.rollingBudget.total}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-300">Bad events</span>
                <span>{report.rollingBudget.bad}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-300">Allowed bad</span>
                <span>{report.rollingBudget.allowedBad.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-300">Remaining budget</span>
                <span>{pct(report.rollingBudget.remainingPct)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-300">Consumed budget</span>
                <span>{pct(report.rollingBudget.consumedPct)}</span>
              </div>
              <div className="mt-2 rounded border border-slate-700 bg-slate-950 p-3 text-xs text-slate-200">
                <div className="font-semibold text-slate-100">
                  Recent latency (sample-based)
                </div>
                <div className="mt-1 flex justify-between">
                  <span className="text-slate-300">p50</span>
                  <span>{report.recent.p50Ms.toFixed(0)}ms</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-300">p95</span>
                  <span>{report.recent.p95Ms.toFixed(0)}ms</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-300">max</span>
                  <span>{report.recent.maxMs.toFixed(0)}ms</span>
                </div>
                <div className="mt-1 text-slate-400">
                  sample={report.recent.sampleCount}
                </div>
              </div>
            </div>
          ) : (
            <p className="mt-4 text-sm text-slate-300">No report yet.</p>
          )}
        </div>
      </section>

      <section className="mt-8 rounded-xl border border-slate-700 bg-slate-900/50 p-5">
        <h2 className="text-lg font-semibold">Burn Rates (multi-window)</h2>
        <p className="mt-2 text-sm text-slate-300">
          Burn rate = bad / allowedBad (per-window). Alerts fire when burn is
          high in both a short and long window (fast + slow).
        </p>
        <div className="mt-4 overflow-auto">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="text-slate-300">
              <tr>
                <th className="py-2 pr-4">Window</th>
                <th className="py-2 pr-4">Total</th>
                <th className="py-2 pr-4">Bad</th>
                <th className="py-2 pr-4">Good rate</th>
                <th className="py-2 pr-4">Burn</th>
              </tr>
            </thead>
            <tbody className="text-slate-100">
              {burnRows.map((r) => (
                <tr key={r.windowLabel} className="border-t border-slate-800">
                  <td className="py-2 pr-4">{r.windowLabel}</td>
                  <td className="py-2 pr-4">{r.total}</td>
                  <td className="py-2 pr-4">{r.bad}</td>
                  <td className="py-2 pr-4">{pct(r.goodRate)}</td>
                  <td className="py-2 pr-4 font-mono text-xs">
                    {Number.isFinite(r.burnRate)
                      ? r.burnRate.toFixed(2)
                      : "inf"}
                  </td>
                </tr>
              ))}
              {!burnRows.length ? (
                <tr>
                  <td colSpan={5} className="py-3 text-slate-300">
                    No traffic yet. Generate burst or run the agent.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>

        {report ? (
          <div className="mt-5 grid gap-3 rounded border border-slate-700 bg-slate-950 p-4 text-sm">
            <div className="font-semibold text-slate-100">Alert evaluation</div>
            <div className="flex justify-between">
              <span className="text-slate-300">Fast (5m+1h)</span>
              <span className={report.alerts.fast.firing ? "text-amber-300" : "text-emerald-300"}>
                {report.alerts.fast.firing ? "FIRING" : "ok"} (threshold {report.alerts.fast.threshold})
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-300">Slow (30m+6h)</span>
              <span className={report.alerts.slow.firing ? "text-amber-300" : "text-emerald-300"}>
                {report.alerts.slow.firing ? "FIRING" : "ok"} (threshold {report.alerts.slow.threshold})
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-300">Release freeze</span>
              <span className={report.alerts.releaseFreeze ? "text-amber-300" : "text-emerald-300"}>
                {report.alerts.releaseFreeze ? "true" : "false"}
              </span>
            </div>
          </div>
        ) : null}
      </section>
    </main>
  );
}

