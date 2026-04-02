"use client";

import { useEffect, useState } from "react";

type Aggregate = {
  id: string;
  label: string;
  likes: number;
  comments: number;
  shares: number;
  rankingDelta: string;
  lagSeconds: number;
};

type AggregationState = {
  window: "hour" | "day" | "week";
  aggregates: Aggregate[];
  totals: { likes: number; comments: number; shares: number };
  sourceHealth: { streamLag: string; reconciliation: string; consumers: string };
  lastMessage: string;
};

export default function Page() {
  const [state, setState] = useState<AggregationState | null>(null);

  async function refresh() {
    const response = await fetch("/api/engagement-aggregation/state");
    setState((await response.json()) as AggregationState);
  }

  async function act(window: AggregationState["window"]) {
    const response = await fetch("/api/engagement-aggregation/action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ window })
    });
    setState((await response.json()) as AggregationState);
  }

  useEffect(() => {
    void refresh();
  }, []);

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="text-3xl font-bold">Engagement Aggregation</h1>
      <p className="mt-2 text-slate-300">Aggregate likes, comments, and shares across time windows so the product can display consistent engagement counters.</p>
      <section className="mt-8 grid gap-6 lg:grid-cols-[320px,1fr]">
        <article className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 text-sm text-slate-300">
          <div className="flex flex-wrap gap-3">
            <button onClick={() => void act("hour")} className="rounded bg-sky-600 px-4 py-2 text-sm font-semibold">Hour</button>
            <button onClick={() => void act("day")} className="rounded border border-slate-700 px-4 py-2 text-sm font-semibold">Day</button>
            <button onClick={() => void act("week")} className="rounded border border-slate-700 px-4 py-2 text-sm font-semibold">Week</button>
          </div>
          <div className="mt-5 space-y-2 text-xs text-slate-400">
            <div className="rounded border border-slate-800 px-3 py-2">stream lag: {state?.sourceHealth.streamLag}</div>
            <div className="rounded border border-slate-800 px-3 py-2">reconciliation: {state?.sourceHealth.reconciliation}</div>
            <div className="rounded border border-slate-800 px-3 py-2">consumers: {state?.sourceHealth.consumers}</div>
          </div>
          <p className="mt-4 text-slate-400">{state?.lastMessage}</p>
        </article>
        <article className="space-y-4">
          <div className="grid gap-3 md:grid-cols-3">
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 text-sm text-slate-300">total likes: {state?.totals.likes ?? 0}</div>
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 text-sm text-slate-300">total comments: {state?.totals.comments ?? 0}</div>
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 text-sm text-slate-300">total shares: {state?.totals.shares ?? 0}</div>
          </div>
          {state?.aggregates.map((aggregate) => (
            <div key={aggregate.id} className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 text-sm text-slate-300">
              <div className="font-semibold text-slate-100">{aggregate.label}</div>
              <div className="mt-3 grid gap-2 md:grid-cols-3">
                <div className="rounded border border-slate-800 px-3 py-2">likes {aggregate.likes}</div>
                <div className="rounded border border-slate-800 px-3 py-2">comments {aggregate.comments}</div>
                <div className="rounded border border-slate-800 px-3 py-2">shares {aggregate.shares}</div>
              </div>
              <div className="mt-3 flex flex-wrap gap-3 text-xs text-slate-400">
                <span className="rounded border border-slate-800 px-2 py-1">ranking delta {aggregate.rankingDelta}</span>
                <span className="rounded border border-slate-800 px-2 py-1">lag {aggregate.lagSeconds}s</span>
              </div>
            </div>
          ))}
        </article>
      </section>
    </main>
  );
}
