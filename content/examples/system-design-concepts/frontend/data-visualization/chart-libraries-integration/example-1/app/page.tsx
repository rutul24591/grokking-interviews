"use client";
import { useEffect, useMemo, useState } from "react";

type SeriesPoint = { label: string; value: number };
type ChartSeries = { id: string; name: string; kind: "line" | "bar"; points: SeriesPoint[]; visible: boolean };
type ChartState = { library: string; filter: string; series: ChartSeries[]; lastMessage: string };

export default function Page() {
  const [state, setState] = useState<ChartState | null>(null);

  async function refresh() {
    const response = await fetch("/api/charts/state");
    setState((await response.json()) as ChartState);
  }

  async function applyFilter(filter: "daily" | "weekly" | "monthly") {
    const response = await fetch("/api/charts/filter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ filter })
    });
    setState((await response.json()) as ChartState);
  }

  useEffect(() => { void refresh(); }, []);

  const visibleSeries = useMemo(() => state?.series.filter((series) => series.visible) ?? [], [state]);
  const labels = visibleSeries[0]?.points.map((point) => point.label) ?? [];

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="text-3xl font-bold">Chart Libraries Integration</h1>
      <p className="mt-2 text-slate-300">Normalize backend series before handing them to a chart abstraction, then expose filter, legend, and mixed-series behavior.</p>
      <section className="mt-8 grid gap-6 lg:grid-cols-[320px,1fr]">
        <article className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 text-sm text-slate-300">
          <div className="rounded-lg border border-slate-800 p-4">
            <div className="text-xs uppercase tracking-wide text-slate-500">Adapter target</div>
            <div className="mt-2 font-semibold text-slate-100">{state?.library}</div>
            <div className="mt-3 text-slate-400">Filter: {state?.filter}</div>
          </div>
          <div className="mt-4 flex flex-wrap gap-3">
            <button onClick={() => void applyFilter("daily")} className="rounded bg-sky-600 px-4 py-2 text-sm font-semibold hover:bg-sky-500">Daily</button>
            <button onClick={() => void applyFilter("weekly")} className="rounded border border-slate-700 px-4 py-2 text-sm font-semibold">Weekly</button>
            <button onClick={() => void applyFilter("monthly")} className="rounded border border-slate-700 px-4 py-2 text-sm font-semibold">Monthly</button>
          </div>
          <p className="mt-4 text-slate-400">{state?.lastMessage}</p>
        </article>
        <article className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
          <div className="grid gap-4 md:grid-cols-3">
            {visibleSeries.map((series) => (
              <div key={series.id} className="rounded-lg border border-slate-800 p-4 text-sm text-slate-300">
                <div className="font-semibold text-slate-100">{series.name}</div>
                <div className="mt-1 text-xs uppercase tracking-wide text-slate-500">{series.kind}</div>
                <ul className="mt-3 space-y-2">
                  {series.points.map((point) => <li key={point.label} className="flex items-center justify-between"><span>{point.label}</span><span>{point.value}</span></li>)}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-5 rounded border border-slate-800 bg-slate-950 p-4 text-sm text-slate-400">Legend order: {visibleSeries.map((series) => series.name).join(" • ")} · shared labels: {labels.join(", ")}</div>
        </article>
      </section>
    </main>
  );
}
