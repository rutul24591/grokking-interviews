"use client";

import { useEffect, useMemo, useState } from "react";

type Experiment = {
  id: string;
  name: string;
  status: "created" | "running" | "stopped" | "completed";
  createdAt: string;
  startedAt?: string;
  stoppedAt?: string;
  durationMs: number;
  blastPct: number;
  fault:
    | { type: "latency"; latencyMs: number }
    | { type: "error"; errorStatus: number }
    | { type: "timeout"; timeoutMs: number };
  hypothesis: { maxErrorRate: number; maxP95Ms: number };
  notes?: string;
};

type Metrics = {
  windowSize: number;
  total: number;
  ok: number;
  errors: number;
  errorRate: number;
  latencyMs: { p50: number; p95: number; max: number };
  updatedAt: string;
};

async function json<T>(input: RequestInfo | URL, init?: RequestInit): Promise<T> {
  const res = await fetch(input, { ...init, headers: { "Content-Type": "application/json", ...(init?.headers || {}) } });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.json() as Promise<T>;
}

export default function Page() {
  const [experiments, setExperiments] = useState<Experiment[]>([]);
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [error, setError] = useState<string>("");

  const [name, setName] = useState("latency-canary");
  const [durationMs, setDurationMs] = useState(30_000);
  const [blastPct, setBlastPct] = useState(20);
  const [faultType, setFaultType] = useState<Experiment["fault"]["type"]>("latency");
  const [latencyMs, setLatencyMs] = useState(250);
  const [errorStatus, setErrorStatus] = useState(503);
  const [timeoutMs, setTimeoutMs] = useState(2_000);
  const [maxErrorRate, setMaxErrorRate] = useState(0.05);
  const [maxP95Ms, setMaxP95Ms] = useState(350);

  const active = useMemo(() => experiments.find((e) => e.status === "running"), [experiments]);

  async function refresh() {
    try {
      const [exps, m] = await Promise.all([
        json<Experiment[]>("/api/experiments"),
        json<Metrics>("/api/metrics/steady-state").catch(() => null),
      ]);
      setExperiments(exps);
      setMetrics(m);
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

  async function createExperiment() {
    const fault =
      faultType === "latency"
        ? { type: "latency" as const, latencyMs }
        : faultType === "error"
          ? { type: "error" as const, errorStatus }
          : { type: "timeout" as const, timeoutMs };

    await json("/api/experiments", {
      method: "POST",
      body: JSON.stringify({
        name,
        durationMs,
        blastPct,
        fault,
        hypothesis: { maxErrorRate, maxP95Ms },
        notes:
          "In production, require approvals + run in staging first. Keep blast radius small and enforce kill switches.",
      }),
    });
    await refresh();
  }

  async function startExperiment(id: string) {
    await json(`/api/experiments/${id}/start`, { method: "POST" });
    await refresh();
  }

  async function stopExperiment(id: string) {
    await json(`/api/experiments/${id}/stop`, { method: "POST" });
    await refresh();
  }

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Chaos Lab</h1>
        <p className="mt-2 text-slate-300">
          A production-shaped chaos-testing demo: hypothesis → inject → observe → stop → report.
        </p>
        <div className="mt-4 rounded-lg border border-slate-700 bg-slate-900/60 p-4 text-sm text-slate-200">
          <div className="font-semibold">Run the agent (recommended)</div>
          <pre className="mt-2 overflow-auto rounded bg-black/40 p-3 text-xs text-slate-100">{`pnpm agent:run -- \\
  --baseUrl http://localhost:3000 \\
  --durationMs 30000 \\
  --concurrency 40 \\
  --blastPct 20 \\
  --fault latency \\
  --latencyMs 250 \\
  --maxErrorRate 0.05 \\
  --maxP95Ms 350`}</pre>
        </div>
        {error ? <div className="mt-4 rounded border border-red-500/40 bg-red-500/10 p-3 text-sm">{error}</div> : null}
      </header>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-700 bg-slate-900/50 p-5">
          <h2 className="text-lg font-semibold">Create Experiment</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className="grid gap-1 text-sm">
              <span className="text-slate-300">Name</span>
              <input className="rounded border border-slate-700 bg-slate-950 px-3 py-2" value={name} onChange={(e) => setName(e.target.value)} />
            </label>
            <label className="grid gap-1 text-sm">
              <span className="text-slate-300">Duration (ms)</span>
              <input type="number" className="rounded border border-slate-700 bg-slate-950 px-3 py-2" value={durationMs} onChange={(e) => setDurationMs(Number(e.target.value))} />
            </label>
            <label className="grid gap-1 text-sm">
              <span className="text-slate-300">Blast radius (%)</span>
              <input type="number" className="rounded border border-slate-700 bg-slate-950 px-3 py-2" value={blastPct} onChange={(e) => setBlastPct(Number(e.target.value))} />
            </label>
            <label className="grid gap-1 text-sm">
              <span className="text-slate-300">Fault type</span>
              <select className="rounded border border-slate-700 bg-slate-950 px-3 py-2" value={faultType} onChange={(e) => setFaultType(e.target.value as any)}>
                <option value="latency">latency</option>
                <option value="error">error</option>
                <option value="timeout">timeout</option>
              </select>
            </label>
            {faultType === "latency" ? (
              <label className="grid gap-1 text-sm">
                <span className="text-slate-300">Latency injected (ms)</span>
                <input type="number" className="rounded border border-slate-700 bg-slate-950 px-3 py-2" value={latencyMs} onChange={(e) => setLatencyMs(Number(e.target.value))} />
              </label>
            ) : null}
            {faultType === "error" ? (
              <label className="grid gap-1 text-sm">
                <span className="text-slate-300">Error status</span>
                <input type="number" className="rounded border border-slate-700 bg-slate-950 px-3 py-2" value={errorStatus} onChange={(e) => setErrorStatus(Number(e.target.value))} />
              </label>
            ) : null}
            {faultType === "timeout" ? (
              <label className="grid gap-1 text-sm">
                <span className="text-slate-300">Timeout delay (ms)</span>
                <input type="number" className="rounded border border-slate-700 bg-slate-950 px-3 py-2" value={timeoutMs} onChange={(e) => setTimeoutMs(Number(e.target.value))} />
              </label>
            ) : null}
            <label className="grid gap-1 text-sm">
              <span className="text-slate-300">Hypothesis: max error rate</span>
              <input type="number" step="0.01" className="rounded border border-slate-700 bg-slate-950 px-3 py-2" value={maxErrorRate} onChange={(e) => setMaxErrorRate(Number(e.target.value))} />
            </label>
            <label className="grid gap-1 text-sm">
              <span className="text-slate-300">Hypothesis: max p95 (ms)</span>
              <input type="number" className="rounded border border-slate-700 bg-slate-950 px-3 py-2" value={maxP95Ms} onChange={(e) => setMaxP95Ms(Number(e.target.value))} />
            </label>
          </div>
          <button
            className="mt-5 rounded-lg bg-indigo-500 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-400 disabled:opacity-50"
            onClick={createExperiment}
            disabled={Boolean(active)}
            title={active ? "Stop the running experiment before creating a new one." : "Create experiment"}
          >
            Create
          </button>
          {active ? (
            <p className="mt-3 text-xs text-slate-400">
              This demo enforces 1 running experiment at a time to keep control-plane behavior easy to reason about.
            </p>
          ) : null}
        </div>

        <div className="rounded-xl border border-slate-700 bg-slate-900/50 p-5">
          <h2 className="text-lg font-semibold">Steady State (Rolling Window)</h2>
          {metrics ? (
            <div className="mt-4 grid gap-3 text-sm">
              <div className="flex justify-between"><span className="text-slate-300">Requests</span><span>{metrics.total} (window {metrics.windowSize})</span></div>
              <div className="flex justify-between"><span className="text-slate-300">Error rate</span><span>{(metrics.errorRate * 100).toFixed(2)}%</span></div>
              <div className="flex justify-between"><span className="text-slate-300">Latency p50</span><span>{metrics.latencyMs.p50.toFixed(0)}ms</span></div>
              <div className="flex justify-between"><span className="text-slate-300">Latency p95</span><span>{metrics.latencyMs.p95.toFixed(0)}ms</span></div>
              <div className="flex justify-between"><span className="text-slate-300">Latency max</span><span>{metrics.latencyMs.max.toFixed(0)}ms</span></div>
              <div className="text-xs text-slate-400">Updated: {new Date(metrics.updatedAt).toLocaleTimeString()}</div>
            </div>
          ) : (
            <p className="mt-4 text-sm text-slate-300">
              No metrics yet. Run the agent or hit <code className="text-slate-100">/api/target</code> a few times.
            </p>
          )}
        </div>
      </section>

      <section className="mt-8 rounded-xl border border-slate-700 bg-slate-900/50 p-5">
        <h2 className="text-lg font-semibold">Experiments</h2>
        <div className="mt-4 overflow-auto">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="text-slate-300">
              <tr>
                <th className="py-2 pr-4">ID</th>
                <th className="py-2 pr-4">Name</th>
                <th className="py-2 pr-4">Status</th>
                <th className="py-2 pr-4">Blast%</th>
                <th className="py-2 pr-4">Fault</th>
                <th className="py-2 pr-4">Hypothesis</th>
                <th className="py-2 pr-4">Actions</th>
              </tr>
            </thead>
            <tbody className="text-slate-100">
              {experiments.map((e) => (
                <tr key={e.id} className="border-t border-slate-800">
                  <td className="py-2 pr-4 font-mono text-xs">{e.id.slice(0, 10)}</td>
                  <td className="py-2 pr-4">{e.name}</td>
                  <td className="py-2 pr-4">
                    <span className={e.status === "running" ? "text-emerald-400" : e.status === "completed" ? "text-sky-300" : "text-slate-300"}>
                      {e.status}
                    </span>
                  </td>
                  <td className="py-2 pr-4">{e.blastPct}%</td>
                  <td className="py-2 pr-4 font-mono text-xs">{e.fault.type}</td>
                  <td className="py-2 pr-4 font-mono text-xs">{`err<=${e.hypothesis.maxErrorRate}, p95<=${e.hypothesis.maxP95Ms}`}</td>
                  <td className="py-2 pr-4">
                    {e.status === "created" ? (
                      <button className="rounded bg-emerald-600 px-3 py-1 text-xs font-semibold hover:bg-emerald-500" onClick={() => startExperiment(e.id)}>
                        Start
                      </button>
                    ) : null}
                    {e.status === "running" ? (
                      <button className="ml-2 rounded bg-amber-600 px-3 py-1 text-xs font-semibold hover:bg-amber-500" onClick={() => stopExperiment(e.id)}>
                        Stop
                      </button>
                    ) : null}
                  </td>
                </tr>
              ))}
              {!experiments.length ? (
                <tr>
                  <td colSpan={7} className="py-3 text-slate-300">
                    No experiments yet. Create one above.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}

