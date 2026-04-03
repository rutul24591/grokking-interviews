"use client";

import { useEffect, useState } from "react";

import { ReviewNote } from "../components/ReviewNote";

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
    
      <section className="rounded-2xl border border-slate-700 bg-slate-900/50 p-5 space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-white">Topic-specific review</h2>
          <p className="mt-1 text-sm text-slate-400">
            This panel captures the operational questions that determine whether client edge caching is truly production-ready, not
            just functionally correct in a happy-path demo.
          </p>
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          <ReviewNote
            title="Operator signal"
            detail="For client edge caching, teams need enough evidence to explain the current state during incidents, reviews, and release gates."
          />
          <ReviewNote
            title="Failure posture"
            detail="For client edge caching, degraded paths should stay deliberate: clear fallbacks, explicit tradeoffs, and no silent state drift."
          />
          <ReviewNote
            title="Audit prompt"
            detail="For client edge caching, validate that a new engineer can inspect this screen, trace the output, and understand the next safe action."
          />
        </div>
        <div className="rounded-xl border border-slate-800 bg-black/30 p-4 text-sm text-slate-300">
          <div className="font-semibold text-white">Why this matters for Client Edge Caching</div>
          <p className="mt-2">
            Strong non-functional examples must go beyond toggles and raw JSON. They need a review layer that makes the
            operational contract visible: what is being protected, what degrades first, and what evidence an operator
            or reviewer should use before changing policy.
          </p>
        </div>
      </section>

</main>
  );
}

