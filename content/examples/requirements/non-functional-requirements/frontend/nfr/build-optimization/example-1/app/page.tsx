"use client";

import { useEffect, useState } from "react";

type Stats = { heavyLoadCount: number };
type Compute = { mode: "light" | "heavy"; result: number; durationMs: number; heavyLoadCount: number };

async function json<T>(input: RequestInfo | URL): Promise<T> {
  const res = await fetch(input, { headers: { "Content-Type": "application/json" } });
  const text = await res.text();
  if (!res.ok) throw new Error(res.status + " " + res.statusText + (text ? " — " + text : ""));
  return text ? (JSON.parse(text) as T) : (undefined as T);
}

export default function Page() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [out, setOut] = useState<Compute | null>(null);
  const [n, setN] = useState(2);
  const [error, setError] = useState("");

  async function refresh() {
    setStats(await json<Stats>("/api/stats"));
  }

  async function run(mode: "light" | "heavy") {
    setError("");
    try {
      setOut(await json<Compute>(`/api/compute?mode=${mode}&n=${n}`));
      await refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  useEffect(() => {
    refresh().catch(() => {});
  }, []);

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Lazy Compute Lab</h1>
        <p className="mt-2 text-slate-300">
          Build optimization is often about keeping “heavy” code behind feature boundaries. This app
          uses a dynamic import to load a heavy module only when needed.
        </p>
        {error ? (
          <div className="mt-4 rounded border border-red-500/40 bg-red-500/10 p-3 text-sm">{error}</div>
        ) : null}
      </header>

      <section className="rounded-xl border border-slate-700 bg-slate-900/50 p-5">
        <div className="flex flex-wrap items-end gap-3">
          <label className="grid gap-1 text-sm">
            <span className="text-slate-300">n (work factor)</span>
            <input
              type="number"
              min={0}
              max={10}
              value={n}
              onChange={(e) => setN(Number(e.target.value))}
              className="w-32 rounded border border-slate-700 bg-black/30 px-3 py-2"
            />
          </label>
          <button
            type="button"
            onClick={() => run("light")}
            className="rounded bg-slate-800 px-4 py-2 text-sm font-semibold hover:bg-slate-700"
          >
            Run light
          </button>
          <button
            type="button"
            onClick={() => run("heavy")}
            className="rounded bg-emerald-600 px-4 py-2 text-sm font-semibold hover:bg-emerald-500"
          >
            Run heavy (dynamic import)
          </button>
          <div className="ml-auto text-sm text-slate-300">
            heavyLoadCount: <span className="font-mono text-slate-100">{stats?.heavyLoadCount ?? 0}</span>
          </div>
        </div>

        {out ? (
          <pre className="mt-4 overflow-auto rounded bg-black/40 p-3 text-xs text-slate-100">
            {JSON.stringify(out, null, 2)}
          </pre>
        ) : null}
      </section>
    </main>
  );
}

