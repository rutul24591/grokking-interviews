"use client";

import { useEffect, useMemo, useState } from "react";

type Variant = "baseline" | "canary";

type VariantBehavior = {
  baseLatencyMs: number;
  jitterMs: number;
  tailPct: number;
  tailLatencyMs: number;
  errorRate: number;
  errorStatus: number;
};

type Config = {
  routing: { canaryPct: number; salt: string };
  guardrails: { maxErrorRateDelta: number; maxP95DeltaMs: number };
  behavior: { baseline: VariantBehavior; canary: VariantBehavior };
};

type VariantStats = {
  total: number;
  ok: number;
  errors: number;
  errorRate: number;
  latencyMs: { p50: number; p95: number; max: number };
  updatedAt: string;
};

type Report = {
  now: string;
  config: Config;
  variants: Record<Variant, VariantStats>;
  comparison: {
    errorRateDelta: number;
    p95DeltaMs: number;
    guardrails: { ok: boolean; reasons: string[] };
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

export default function Page() {
  const [config, setConfig] = useState<Config | null>(null);
  const [report, setReport] = useState<Report | null>(null);
  const [error, setError] = useState<string>("");

  const [canaryPct, setCanaryPct] = useState(5);
  const [salt, setSalt] = useState("rollout-1");
  const [maxErrorRateDelta, setMaxErrorRateDelta] = useState(0.01);
  const [maxP95DeltaMs, setMaxP95DeltaMs] = useState(80);

  const [baseline, setBaseline] = useState<VariantBehavior>({
    baseLatencyMs: 80,
    jitterMs: 20,
    tailPct: 0.05,
    tailLatencyMs: 300,
    errorRate: 0.002,
    errorStatus: 503,
  });
  const [canary, setCanary] = useState<VariantBehavior>({
    baseLatencyMs: 90,
    jitterMs: 25,
    tailPct: 0.07,
    tailLatencyMs: 450,
    errorRate: 0.01,
    errorStatus: 503,
  });

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
    setCanaryPct(config.routing.canaryPct);
    setSalt(config.routing.salt);
    setMaxErrorRateDelta(config.guardrails.maxErrorRateDelta);
    setMaxP95DeltaMs(config.guardrails.maxP95DeltaMs);
    setBaseline(config.behavior.baseline);
    setCanary(config.behavior.canary);
  }, [config]);

  async function saveConfig() {
    await json("/api/config", {
      method: "POST",
      body: JSON.stringify({
        routing: { canaryPct, salt },
        guardrails: { maxErrorRateDelta, maxP95DeltaMs },
        behavior: { baseline, canary },
      }),
    });
    await refresh();
  }

  async function reset() {
    await json("/api/reset", { method: "POST" });
    await refresh();
  }

  async function generateBurst() {
    const users = Array.from({ length: 500 }, (_, i) => `user-${i}`);
    const reqs = users.map((u) =>
      fetch("/api/serve", {
        headers: { "x-user-id": u },
        cache: "no-store",
      }).catch(() => null),
    );
    await Promise.all(reqs);
    await refresh();
  }

  const guardrailOk = report?.comparison.guardrails.ok ?? true;
  const guardrailReasons = report?.comparison.guardrails.reasons ?? [];

  const variants = useMemo(() => report?.variants, [report?.variants]);

  function BehaviorEditor(props: {
    label: string;
    value: VariantBehavior;
    onChange: (v: VariantBehavior) => void;
  }) {
    const v = props.value;
    return (
      <div className="rounded-lg border border-slate-700 bg-slate-950 p-4">
        <div className="text-sm font-semibold text-slate-100">{props.label}</div>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <label className="grid gap-1 text-xs">
            <span className="text-slate-300">Base latency (ms)</span>
            <input
              type="number"
              className="rounded border border-slate-700 bg-black/40 px-3 py-2 text-sm"
              value={v.baseLatencyMs}
              onChange={(e) => props.onChange({ ...v, baseLatencyMs: Number(e.target.value) })}
            />
          </label>
          <label className="grid gap-1 text-xs">
            <span className="text-slate-300">Jitter (ms)</span>
            <input
              type="number"
              className="rounded border border-slate-700 bg-black/40 px-3 py-2 text-sm"
              value={v.jitterMs}
              onChange={(e) => props.onChange({ ...v, jitterMs: Number(e.target.value) })}
            />
          </label>
          <label className="grid gap-1 text-xs">
            <span className="text-slate-300">Tail %</span>
            <input
              type="number"
              step="0.01"
              className="rounded border border-slate-700 bg-black/40 px-3 py-2 text-sm"
              value={v.tailPct}
              onChange={(e) => props.onChange({ ...v, tailPct: Number(e.target.value) })}
            />
          </label>
          <label className="grid gap-1 text-xs">
            <span className="text-slate-300">Tail latency (ms)</span>
            <input
              type="number"
              className="rounded border border-slate-700 bg-black/40 px-3 py-2 text-sm"
              value={v.tailLatencyMs}
              onChange={(e) => props.onChange({ ...v, tailLatencyMs: Number(e.target.value) })}
            />
          </label>
          <label className="grid gap-1 text-xs">
            <span className="text-slate-300">Error rate</span>
            <input
              type="number"
              step="0.001"
              className="rounded border border-slate-700 bg-black/40 px-3 py-2 text-sm"
              value={v.errorRate}
              onChange={(e) => props.onChange({ ...v, errorRate: Number(e.target.value) })}
            />
          </label>
          <label className="grid gap-1 text-xs">
            <span className="text-slate-300">Error status</span>
            <input
              type="number"
              className="rounded border border-slate-700 bg-black/40 px-3 py-2 text-sm"
              value={v.errorStatus}
              onChange={(e) => props.onChange({ ...v, errorStatus: Number(e.target.value) })}
            />
          </label>
        </div>
      </div>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <header className="mb-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Canary Lab</h1>
            <p className="mt-2 text-slate-300">
              Sticky routing + per-variant SLIs + guardrails + automated ramp.
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

        {!guardrailOk ? (
          <div className="mt-4 rounded border border-amber-500/40 bg-amber-500/10 p-3 text-sm">
            <div className="font-semibold text-amber-200">Guardrail breach</div>
            <div className="mt-1 text-slate-200">
              {guardrailReasons.length ? guardrailReasons.join("; ") : "canary is worse than baseline"}
            </div>
          </div>
        ) : null}
      </header>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-700 bg-slate-900/50 p-5">
          <h2 className="text-lg font-semibold">Routing & Guardrails</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className="grid gap-1 text-sm">
              <span className="text-slate-300">Canary %</span>
              <input
                type="number"
                className="rounded border border-slate-700 bg-slate-950 px-3 py-2"
                value={canaryPct}
                onChange={(e) => setCanaryPct(Number(e.target.value))}
              />
            </label>
            <label className="grid gap-1 text-sm">
              <span className="text-slate-300">Salt</span>
              <input
                className="rounded border border-slate-700 bg-slate-950 px-3 py-2"
                value={salt}
                onChange={(e) => setSalt(e.target.value)}
              />
            </label>
            <label className="grid gap-1 text-sm">
              <span className="text-slate-300">Max error-rate delta</span>
              <input
                type="number"
                step="0.001"
                className="rounded border border-slate-700 bg-slate-950 px-3 py-2"
                value={maxErrorRateDelta}
                onChange={(e) => setMaxErrorRateDelta(Number(e.target.value))}
              />
            </label>
            <label className="grid gap-1 text-sm">
              <span className="text-slate-300">Max p95 delta (ms)</span>
              <input
                type="number"
                className="rounded border border-slate-700 bg-slate-950 px-3 py-2"
                value={maxP95DeltaMs}
                onChange={(e) => setMaxP95DeltaMs(Number(e.target.value))}
              />
            </label>
          </div>
          <button
            className="mt-5 rounded-lg bg-indigo-500 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-400"
            onClick={saveConfig}
          >
            Save config
          </button>
          <div className="mt-4 rounded border border-slate-700 bg-slate-950 p-3 text-xs text-slate-200">
            <div className="font-semibold text-slate-100">How routing works</div>
            <div className="mt-1 text-slate-300">
              Variant is chosen by hashing <code className="text-slate-100">x-user-id</code> with a salt. The same user
              stays assigned while salt+percent remain unchanged.
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-700 bg-slate-900/50 p-5">
          <h2 className="text-lg font-semibold">Live Metrics</h2>
          {variants ? (
            <div className="mt-4 grid gap-4">
              {(["baseline", "canary"] as Variant[]).map((k) => (
                <div key={k} className="rounded-lg border border-slate-700 bg-slate-950 p-4 text-sm">
                  <div className="flex items-center justify-between">
                    <div className="font-semibold text-slate-100">{k}</div>
                    <div className="text-xs text-slate-400">
                      updated {new Date(variants[k].updatedAt).toLocaleTimeString()}
                    </div>
                  </div>
                  <div className="mt-3 grid gap-2 sm:grid-cols-2">
                    <div className="flex justify-between"><span className="text-slate-300">requests</span><span>{variants[k].total}</span></div>
                    <div className="flex justify-between"><span className="text-slate-300">error rate</span><span>{pct(variants[k].errorRate)}</span></div>
                    <div className="flex justify-between"><span className="text-slate-300">p50</span><span>{variants[k].latencyMs.p50.toFixed(0)}ms</span></div>
                    <div className="flex justify-between"><span className="text-slate-300">p95</span><span>{variants[k].latencyMs.p95.toFixed(0)}ms</span></div>
                  </div>
                </div>
              ))}
              {report ? (
                <div className="rounded-lg border border-slate-700 bg-slate-950 p-4 text-sm">
                  <div className="font-semibold text-slate-100">Comparison</div>
                  <div className="mt-3 grid gap-2 sm:grid-cols-2">
                    <div className="flex justify-between">
                      <span className="text-slate-300">errorRate Δ</span>
                      <span className={report.comparison.errorRateDelta > maxErrorRateDelta ? "text-amber-300" : "text-emerald-300"}>
                        {pct(report.comparison.errorRateDelta)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-300">p95 Δ</span>
                      <span className={report.comparison.p95DeltaMs > maxP95DeltaMs ? "text-amber-300" : "text-emerald-300"}>
                        {report.comparison.p95DeltaMs.toFixed(0)}ms
                      </span>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          ) : (
            <p className="mt-4 text-sm text-slate-300">
              No metrics yet. Click “Generate burst” or run the agent.
            </p>
          )}
        </div>
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-2">
        <BehaviorEditor label="Baseline behavior" value={baseline} onChange={setBaseline} />
        <BehaviorEditor label="Canary behavior" value={canary} onChange={setCanary} />
      </section>
    </main>
  );
}

