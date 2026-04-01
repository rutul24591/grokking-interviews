"use client";
import { useEffect, useState } from "react";

type StreamMetric = {
  id: string;
  label: string;
  current: number;
  lagMs: number;
  history: number[];
  burstRate: number;
  status: "healthy" | "lagging" | "coalesced";
};
type RealtimeState = { paused: boolean; mode: string; staleBanner: boolean; metrics: StreamMetric[]; lastMessage: string };

export default function Page() {
  const [state, setState] = useState<RealtimeState | null>(null);

  async function refresh() {
    const response = await fetch("/api/realtime/state");
    setState((await response.json()) as RealtimeState);
  }

  async function toggle(paused: boolean) {
    const response = await fetch("/api/realtime/toggle", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ paused })
    });
    setState((await response.json()) as RealtimeState);
  }

  useEffect(() => { void refresh(); }, []);

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="text-3xl font-bold">Real-time Data Updates</h1>
      <p className="mt-2 text-slate-300">Handle live streams with bounded history, lag indicators, and analyst-controlled pause/resume behavior.</p>
      <section className="mt-8 grid gap-6 lg:grid-cols-[320px,1fr]">
        <article className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 text-sm text-slate-300">
          <div className="rounded-lg border border-slate-800 p-4">
            <div className="text-xs uppercase tracking-wide text-slate-500">Mode</div>
            <div className="mt-2 font-semibold text-slate-100">{state?.mode}</div>
            <div className="mt-3 text-slate-400">Paused: {String(state?.paused)}</div>
          </div>
          <div className="mt-4 rounded-lg border border-slate-800 px-3 py-3 text-slate-300">
            Stale banner: <span className="font-semibold text-slate-100">{String(state?.staleBanner)}</span>
          </div>
          <div className="mt-4 flex gap-3">
            <button onClick={() => void toggle(true)} className="rounded bg-sky-600 px-4 py-2 text-sm font-semibold hover:bg-sky-500">Pause stream</button>
            <button onClick={() => void toggle(false)} className="rounded border border-slate-700 px-4 py-2 text-sm font-semibold">Resume stream</button>
          </div>
          <p className="mt-4 text-slate-400">{state?.lastMessage}</p>
        </article>
        <article className="grid gap-4 md:grid-cols-2">
          {state?.metrics.map((metric) => (
            <div key={metric.id} className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 text-sm text-slate-300">
              <div className="font-semibold text-slate-100">{metric.label}</div>
              <div className="mt-2 text-slate-400">Current: {metric.current}</div>
              <div className="mt-1 text-slate-400">Lag: {metric.lagMs}ms</div>
              <div className="mt-1 text-slate-400">Burst rate: {metric.burstRate}/s</div>
              <div className="mt-1 text-slate-400">Status: {metric.status}</div>
              <div className="mt-3 rounded border border-slate-800 px-3 py-3 text-slate-400">History: {metric.history.join(" → ")}</div>
            </div>
          ))}
        </article>
      </section>
    </main>
  );
}
