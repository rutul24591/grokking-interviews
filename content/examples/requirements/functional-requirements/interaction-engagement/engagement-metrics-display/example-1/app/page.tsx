"use client";

import { useEffect, useState } from "react";

type MetricCard = {
  id: string;
  label: string;
  value: number;
  trend: "up" | "down" | "flat";
  baseline: number;
  approximate: boolean;
  visibility: string;
};

type MetricsState = {
  range: "today" | "week" | "month";
  cards: MetricCard[];
  summary: { healthyCards: number; approximateCards: number; lastRefreshMinutes: number };
  lastMessage: string;
};

export default function Page() {
  const [state, setState] = useState<MetricsState | null>(null);

  async function refresh() {
    const response = await fetch("/api/engagement-metrics-display/state");
    setState((await response.json()) as MetricsState);
  }

  async function act(range: MetricsState["range"]) {
    const response = await fetch("/api/engagement-metrics-display/action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ range })
    });
    setState((await response.json()) as MetricsState);
  }

  useEffect(() => {
    void refresh();
  }, []);

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="text-3xl font-bold">Engagement Metrics Display</h1>
      <p className="mt-2 text-slate-300">Switch time ranges and expose user-facing engagement metrics with trend context, not just raw counters.</p>
      <section className="mt-8 grid gap-6 lg:grid-cols-[320px,1fr]">
        <article className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 text-sm text-slate-300">
          <div className="flex flex-wrap gap-3">
            <button onClick={() => void act("today")} className="rounded bg-sky-600 px-4 py-2 text-sm font-semibold">Today</button>
            <button onClick={() => void act("week")} className="rounded border border-slate-700 px-4 py-2 text-sm font-semibold">Week</button>
            <button onClick={() => void act("month")} className="rounded border border-slate-700 px-4 py-2 text-sm font-semibold">Month</button>
          </div>
          <div className="mt-5 grid gap-3 text-xs text-slate-400">
            <div className="rounded border border-slate-800 px-3 py-2">healthy cards: {state?.summary.healthyCards ?? 0}</div>
            <div className="rounded border border-slate-800 px-3 py-2">approximate cards: {state?.summary.approximateCards ?? 0}</div>
            <div className="rounded border border-slate-800 px-3 py-2">last refresh: {state?.summary.lastRefreshMinutes ?? 0}m ago</div>
          </div>
          <p className="mt-4 text-slate-400">{state?.lastMessage}</p>
        </article>
        <article className="grid gap-4 md:grid-cols-2">
          {state?.cards.map((card) => (
            <div key={card.id} className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 text-sm text-slate-300">
              <div className="text-xs uppercase tracking-wide text-slate-500">{card.label}</div>
              <div className="mt-2 text-2xl font-semibold text-slate-100">{card.value}</div>
              <div className="mt-1 text-xs text-slate-500">trend {card.trend} · baseline {card.baseline}</div>
              <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-400">
                <span className="rounded border border-slate-800 px-2 py-1">{card.approximate ? "approximate" : "exact"}</span>
                <span className="rounded border border-slate-800 px-2 py-1">visible on {card.visibility}</span>
              </div>
            </div>
          ))}
        </article>
      </section>
    </main>
  );
}
