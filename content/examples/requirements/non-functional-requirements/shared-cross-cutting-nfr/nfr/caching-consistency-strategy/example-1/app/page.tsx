"use client";

import { useEffect, useState } from "react";

async function json<T>(input: RequestInfo | URL, init?: RequestInit): Promise<T> {
  const res = await fetch(input, { ...init, headers: { "Content-Type": "application/json", ...(init?.headers || {}) } });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.json() as Promise<T>;
}

export default function Page() {
  const [state, setState] = useState<any>(null);
  const [strategy, setStrategy] = useState<"invalidation" | "versioned">("invalidation");
  const [ttlMs, setTtlMs] = useState(2000);
  const [value, setValue] = useState("hello");
  const [error, setError] = useState("");

  async function refresh() {
    try {
      setState(await json("/api/state"));
      const cfg = await json<any>("/api/config");
      setStrategy(cfg.strategy);
      setTtlMs(cfg.ttlMs);
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

  async function read() {
    await json("/api/item?id=item-1");
    await refresh();
  }

  async function write() {
    await json("/api/item", { method: "PUT", body: JSON.stringify({ id: "item-1", value }) });
    await refresh();
  }

  async function updateConfig() {
    await json("/api/config", { method: "POST", body: JSON.stringify({ strategy, ttlMs }) });
    await refresh();
  }

  async function reset() {
    await json("/api/reset", { method: "POST", body: "{}" });
    await refresh();
  }

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Cache Consistency Lab</h1>
        <p className="mt-2 text-slate-300">Compare invalidation vs versioned keys under TTL.</p>
        {error ? <div className="mt-4 rounded border border-red-500/40 bg-red-500/10 p-3 text-sm">{error}</div> : null}
      </header>

      <section className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-xl border border-slate-700 bg-slate-900/50 p-5 lg:col-span-1">
          <h2 className="text-lg font-semibold">Controls</h2>
          <div className="mt-4 grid gap-3">
            <label className="grid gap-1">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-300">Strategy</span>
              <select className="rounded border border-slate-700 bg-slate-950 px-3 py-2 text-sm" value={strategy} onChange={(e) => setStrategy(e.target.value as any)}>
                <option value="invalidation">invalidation</option>
                <option value="versioned">versioned keys</option>
              </select>
            </label>
            <label className="grid gap-1">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-300">TTL ms</span>
              <input type="number" min={100} max={30000} className="rounded border border-slate-700 bg-slate-950 px-3 py-2 text-sm" value={ttlMs} onChange={(e) => setTtlMs(Number(e.target.value))} />
            </label>
            <button className="rounded bg-slate-800 px-4 py-2 text-sm font-semibold hover:bg-slate-700" onClick={updateConfig}>
              Apply config
            </button>
            <label className="grid gap-1">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-300">Write value</span>
              <input className="rounded border border-slate-700 bg-slate-950 px-3 py-2 text-sm" value={value} onChange={(e) => setValue(e.target.value)} />
            </label>
            <div className="flex flex-wrap gap-2">
              <button className="rounded bg-emerald-600 px-4 py-2 text-sm font-semibold hover:bg-emerald-500" onClick={read}>Read</button>
              <button className="rounded bg-sky-600 px-4 py-2 text-sm font-semibold hover:bg-sky-500" onClick={write}>Write</button>
              <button className="ml-auto rounded bg-slate-800 px-4 py-2 text-sm font-semibold hover:bg-slate-700" onClick={reset}>Reset</button>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-700 bg-slate-900/50 p-5 lg:col-span-2">
          <h2 className="text-lg font-semibold">State</h2>
          <pre className="mt-4 overflow-auto rounded border border-slate-800 bg-black/40 p-4 text-xs text-slate-100">
{JSON.stringify(state, null, 2)}
          </pre>
        </div>
      </section>
    </main>
  );
}

