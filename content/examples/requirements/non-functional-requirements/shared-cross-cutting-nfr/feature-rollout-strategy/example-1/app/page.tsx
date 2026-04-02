"use client";

import { useEffect, useMemo, useState } from "react";

async function json<T>(input: RequestInfo | URL, init?: RequestInit): Promise<T> {
  const res = await fetch(input, { ...init, headers: { "Content-Type": "application/json", ...(init?.headers || {}) } });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.json() as Promise<T>;
}

export default function Page() {
  const [flag, setFlag] = useState<any>(null);
  const [metrics, setMetrics] = useState<any>(null);
  const [userId, setUserId] = useState("user-1");
  const [evalRes, setEvalRes] = useState<any>(null);
  const [error, setError] = useState("");

  async function refresh() {
    try {
      const [f, m] = await Promise.all([json("/api/flags"), json("/api/metrics")]);
      setFlag(f);
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

  async function evaluate() {
    const r = await json(`/api/eval?userId=${encodeURIComponent(userId)}`);
    setEvalRes(r);
  }

  async function updateFlag(patch: any) {
    await json("/api/flags", { method: "POST", body: JSON.stringify({ ...flag, ...patch }) });
    await refresh();
  }

  async function reset() {
    await json("/api/reset", { method: "POST", body: "{}" });
    await refresh();
  }

  const gate = useMemo(() => {
    const er = metrics?.errorRate ?? 0;
    return er <= 0.05 ? "healthy" : "violating";
  }, [metrics]);

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Feature Rollout Control Plane</h1>
        <p className="mt-2 text-slate-300">Deterministic rollout + guardrails + kill switch.</p>
        {error ? <div className="mt-4 rounded border border-red-500/40 bg-red-500/10 p-3 text-sm">{error}</div> : null}
      </header>

      <section className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-xl border border-slate-700 bg-slate-900/50 p-5 lg:col-span-1">
          <h2 className="text-lg font-semibold">Flag</h2>
          <div className="mt-4 grid gap-3">
            <label className="flex items-center gap-2 text-sm text-slate-200">
              <input type="checkbox" checked={Boolean(flag?.enabled)} onChange={(e) => updateFlag({ enabled: e.target.checked })} />
              enabled
            </label>
            <label className="flex items-center gap-2 text-sm text-slate-200">
              <input type="checkbox" checked={Boolean(flag?.killSwitch)} onChange={(e) => updateFlag({ killSwitch: e.target.checked })} />
              kill switch
            </label>
            <label className="grid gap-1">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-300">Rollout %</span>
              <input type="number" min={0} max={100} className="rounded border border-slate-700 bg-slate-950 px-3 py-2 text-sm" value={flag?.rolloutPct ?? 0} onChange={(e) => updateFlag({ rolloutPct: Number(e.target.value) })} />
            </label>
            <button className="rounded bg-slate-800 px-4 py-2 text-sm font-semibold hover:bg-slate-700" onClick={reset}>Reset</button>
          </div>
          <div className="mt-6 rounded border border-slate-800 bg-black/30 p-4 text-sm text-slate-200">
            <div className="font-semibold">Guardrail</div>
            <div className={"mt-1 font-semibold " + (gate === "healthy" ? "text-emerald-400" : "text-red-400")}>{gate}</div>
            <div className="mt-2 text-xs text-slate-300">errorRate: {(metrics?.errorRate ?? 0).toFixed(3)}</div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-700 bg-slate-900/50 p-5 lg:col-span-2">
          <h2 className="text-lg font-semibold">Evaluate</h2>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <input className="rounded border border-slate-700 bg-slate-950 px-3 py-2 text-sm" value={userId} onChange={(e) => setUserId(e.target.value)} />
            <button className="rounded bg-sky-600 px-4 py-2 text-sm font-semibold hover:bg-sky-500" onClick={evaluate}>Eval</button>
          </div>
          <pre className="mt-4 overflow-auto rounded border border-slate-800 bg-black/40 p-4 text-xs text-slate-100">{JSON.stringify({ evalRes, flag, metrics }, null, 2)}</pre>
        </div>
      </section>
    </main>
  );
}

