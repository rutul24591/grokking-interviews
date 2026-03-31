"use client";

import { useEffect, useState } from "react";

type Widget = { widgetId: string; label: string; intervalActive: boolean; timeoutActive: boolean; ticks: number };
type TimerState = { intervals: number; timeouts: number; logs: string[]; widgets: Widget[] };

export default function TimerCleanupLab() {
  const [state, setState] = useState<TimerState | null>(null);

  async function refresh() {
    const response = await fetch("http://localhost:4536/state");
    setState((await response.json()) as TimerState);
  }

  useEffect(() => {
    void refresh();
  }, []);

  async function run(actionId: string, widgetId = "") {
    await fetch("http://localhost:4536/timer/action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ actionId, widgetId })
    });
    await refresh();
  }

  return (
    <section className="mt-8 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
      <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-950">Timer registry</h2>
        <div className="mt-4 flex flex-wrap gap-2 text-sm">
          <button className="rounded-full bg-slate-950 px-4 py-2 font-semibold text-white" onClick={() => void run("cleanup-all")}>Cleanup all</button>
          <button className="rounded-full bg-emerald-100 px-4 py-2 font-semibold text-emerald-800" onClick={() => void run("reset")}>Reset</button>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 text-sm text-slate-700">
          <div className="rounded-2xl bg-slate-50 px-4 py-3">Intervals: {state?.intervals ?? 0}</div>
          <div className="rounded-2xl bg-slate-50 px-4 py-3">Timeouts: {state?.timeouts ?? 0}</div>
        </div>
        <ul className="mt-4 space-y-2 text-sm text-slate-700">{state?.logs.map((log) => <li key={log}>• {log}</li>)}</ul>
      </article>
      <article className="space-y-4">
        {state?.widgets.map((widget) => (
          <div key={widget.widgetId} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-lg font-semibold text-slate-950">{widget.label}</h3>
              <div className="flex gap-2 text-xs font-semibold">
                {widget.intervalActive && <span className="rounded-full bg-indigo-100 px-2 py-1 text-indigo-800">interval</span>}
                {widget.timeoutActive && <span className="rounded-full bg-amber-100 px-2 py-1 text-amber-800">timeout</span>}
              </div>
            </div>
            <p className="mt-3 text-sm text-slate-700">Ticks processed: {widget.ticks}</p>
            <div className="mt-4 flex flex-wrap gap-2 text-sm">
              <button className="rounded-full bg-slate-950 px-3 py-1.5 font-semibold text-white" onClick={() => void run("toggle-widget", widget.widgetId)}>
                {widget.intervalActive || widget.timeoutActive ? "Unmount widget" : "Mount widget"}
              </button>
              <button className="rounded-full bg-indigo-100 px-3 py-1.5 font-semibold text-indigo-800" onClick={() => void run("tick", widget.widgetId)}>Tick interval</button>
              <button className="rounded-full bg-rose-100 px-3 py-1.5 font-semibold text-rose-800" onClick={() => void run("timeout", widget.widgetId)}>Fire timeout</button>
            </div>
          </div>
        ))}
      </article>
    </section>
  );
}
