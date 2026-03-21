"use client";

import { useEffect, useState } from "react";

async function json<T>(input: RequestInfo | URL, init?: RequestInit): Promise<T> {
  const res = await fetch(input, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
  });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.json() as Promise<T>;
}

function rnd(min: number, max: number) {
  return min + Math.random() * (max - min);
}

export default function Page() {
  const [report, setReport] = useState<any>(null);
  const [error, setError] = useState("");
  const [mode, setMode] = useState<"good" | "bad">("good");

  async function refresh() {
    try {
      setReport(await json("/api/report"));
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

  async function pushSamples(n: number) {
    for (let i = 0; i < n; i++) {
      const ttfbMs = mode === "good" ? rnd(60, 220) : rnd(150, 700);
      const longTaskMs = mode === "good" ? rnd(0, 60) : rnd(40, 180);
      const bytes = mode === "good" ? Math.floor(rnd(12_000, 36_000)) : Math.floor(rnd(25_000, 120_000));
      await json("/api/sample", { method: "POST", body: JSON.stringify({ route: "/", ttfbMs, longTaskMs, bytes }) });
    }
    await refresh();
  }

  async function reset() {
    await json("/api/reset", { method: "POST", body: "{}" });
    await refresh();
  }

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Performance Budget Gate</h1>
        <p className="mt-2 text-slate-300">
          Push samples, compute percentiles, and gate on budget regressions.
        </p>
        {error ? (
          <div className="mt-4 rounded border border-red-500/40 bg-red-500/10 p-3 text-sm">{error}</div>
        ) : null}
      </header>

      <section className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-xl border border-slate-700 bg-slate-900/50 p-5 lg:col-span-1">
          <h2 className="text-lg font-semibold">Controls</h2>
          <div className="mt-4 flex gap-2">
            {(["good", "bad"] as const).map((m) => (
              <button
                key={m}
                type="button"
                className={
                  "rounded px-3 py-2 text-sm font-semibold " +
                  (mode === m ? "bg-emerald-600 hover:bg-emerald-500" : "bg-slate-800 hover:bg-slate-700")
                }
                onClick={() => setMode(m)}
              >
                {m}
              </button>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <button className="rounded bg-sky-600 px-4 py-2 text-sm font-semibold hover:bg-sky-500" onClick={() => pushSamples(50)}>
              Push 50 samples
            </button>
            <button className="rounded bg-slate-800 px-4 py-2 text-sm font-semibold hover:bg-slate-700" onClick={reset}>
              Reset
            </button>
          </div>
          <div className="mt-6 rounded border border-slate-800 bg-black/30 p-4 text-sm text-slate-200">
            <div className="font-semibold">Gate</div>
            <div className="mt-2">
              {report?.gate?.ok ? (
                <span className="font-semibold text-emerald-400">PASS</span>
              ) : (
                <span className="font-semibold text-red-400">FAIL</span>
              )}
            </div>
            <div className="mt-2 text-xs text-slate-300">samples: {report?.samples ?? 0}</div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-700 bg-slate-900/50 p-5 lg:col-span-2">
          <h2 className="text-lg font-semibold">Report</h2>
          <pre className="mt-4 overflow-auto rounded border border-slate-800 bg-black/40 p-4 text-xs text-slate-100">
{JSON.stringify(report, null, 2)}
          </pre>
        </div>
      </section>
    </main>
  );
}

