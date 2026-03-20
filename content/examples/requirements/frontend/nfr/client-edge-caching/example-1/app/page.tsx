"use client";

import { useEffect, useState } from "react";

type Stats = {
  originVersion: number;
  originHits: number;
  edgeHits: number;
  edgeMisses: number;
  cacheEntries: number;
};

type Resp = { origin: { version: number; payload: string; etag: string } };

async function json<T>(input: RequestInfo | URL, init?: RequestInit): Promise<T> {
  const res = await fetch(input, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
  });
  const text = await res.text();
  if (!res.ok) throw new Error(res.status + " " + res.statusText + (text ? " — " + text : ""));
  return text ? (JSON.parse(text) as T) : (undefined as T);
}

export default function Page() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [edge, setEdge] = useState<Resp | null>(null);
  const [origin, setOrigin] = useState<Resp | null>(null);
  const [error, setError] = useState("");

  async function refresh() {
    const r = await json<{ stats: Stats }>("/api/stats");
    setStats(r.stats);
  }

  async function hitOrigin() {
    setError("");
    try {
      setOrigin(await json<Resp>("/api/origin/resource"));
      await refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  async function hitEdge() {
    setError("");
    try {
      const res = await fetch("/api/edge/resource", { headers: { "Content-Type": "application/json" } });
      const text = await res.text();
      if (!res.ok) throw new Error(res.status + " " + res.statusText);
      setEdge(text ? (JSON.parse(text) as Resp) : null);
      await refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  async function reset() {
    await json("/api/reset", { method: "POST", body: "{}" });
    setEdge(null);
    setOrigin(null);
    await refresh();
  }

  useEffect(() => {
    refresh().catch(() => {});
  }, []);

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Caching Lab</h1>
        <p className="mt-2 text-slate-300">
          Simulates a simple origin + edge cache, so you can observe hit/miss behavior and TTL trade-offs.
        </p>
        {error ? (
          <div className="mt-4 rounded border border-red-500/40 bg-red-500/10 p-3 text-sm">{error}</div>
        ) : null}
      </header>

      <section className="rounded-xl border border-slate-700 bg-slate-900/50 p-5">
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={hitOrigin}
            className="rounded bg-slate-800 px-4 py-2 text-sm font-semibold hover:bg-slate-700"
          >
            Hit origin
          </button>
          <button
            type="button"
            onClick={hitEdge}
            className="rounded bg-emerald-600 px-4 py-2 text-sm font-semibold hover:bg-emerald-500"
          >
            Hit edge
          </button>
          <button
            type="button"
            onClick={reset}
            className="ml-auto rounded bg-amber-700 px-4 py-2 text-sm font-semibold hover:bg-amber-600"
          >
            Reset
          </button>
        </div>

        <pre className="mt-4 overflow-auto rounded bg-black/40 p-3 text-xs text-slate-100">
          {JSON.stringify({ stats, edge, origin }, null, 2)}
        </pre>
      </section>
    </main>
  );
}

