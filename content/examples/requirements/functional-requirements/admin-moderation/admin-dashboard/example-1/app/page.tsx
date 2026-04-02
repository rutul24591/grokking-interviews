"use client";

import { useEffect, useState } from "react";

type Metric = { id: string; label: string; value: number; trend: "up" | "down" | "flat" };
type QueueSnapshot = { id: string; name: string; backlog: number; oldestMinutes: number; staffed: string };
type DashboardAlert = { id: string; title: string; severity: "high" | "medium"; acknowledged: boolean };

type DashboardState = {
  activePanel: "overview" | "queues" | "alerts";
  metrics: Metric[];
  queues: QueueSnapshot[];
  alerts: DashboardAlert[];
  lastMessage: string;
};

export default function Page() {
  const [state, setState] = useState<DashboardState | null>(null);

  async function refresh() {
    const response = await fetch("/api/admin-dashboard/state");
    setState((await response.json()) as DashboardState);
  }

  async function switchPanel(activePanel: DashboardState["activePanel"]) {
    const response = await fetch("/api/admin-dashboard/action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ activePanel })
    });
    setState((await response.json()) as DashboardState);
  }

  useEffect(() => { void refresh(); }, []);

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      <p className="mt-2 text-slate-300">Switch between overview, queues, and alert panels while tracking moderation workload and operational health.</p>
      <section className="mt-8 grid gap-6 lg:grid-cols-[320px,1fr]">
        <article className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 text-sm text-slate-300">
          <div className="flex flex-wrap gap-3">
            <button onClick={() => void switchPanel("overview")} className="rounded bg-sky-600 px-4 py-2 text-sm font-semibold">Overview</button>
            <button onClick={() => void switchPanel("queues")} className="rounded border border-slate-700 px-4 py-2 text-sm font-semibold">Queues</button>
            <button onClick={() => void switchPanel("alerts")} className="rounded border border-slate-700 px-4 py-2 text-sm font-semibold">Alerts</button>
          </div>
          <p className="mt-4 text-slate-400">{state?.lastMessage}</p>
        </article>
        <article className="grid gap-4 md:grid-cols-2">
          {state?.activePanel === "overview" &&
            state.metrics.map((metric) => (
              <div key={metric.id} className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 text-sm text-slate-300">
                <div className="text-xs uppercase tracking-wide text-slate-500">{metric.label}</div>
                <div className="mt-2 text-2xl font-semibold text-slate-100">{metric.value}</div>
                <div className="mt-1 text-xs text-slate-500">trend {metric.trend}</div>
              </div>
            ))}
          {state?.activePanel === "queues" &&
            state.queues.map((queue) => (
              <div key={queue.id} className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 text-sm text-slate-300">
                <div className="font-semibold text-slate-100">{queue.name}</div>
                <div className="mt-2 text-xs text-slate-500">backlog {queue.backlog} · oldest {queue.oldestMinutes}m</div>
                <div className="mt-3 rounded border border-slate-800 px-3 py-2">staffed by {queue.staffed}</div>
              </div>
            ))}
          {state?.activePanel === "alerts" &&
            state.alerts.map((alert) => (
              <div key={alert.id} className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 text-sm text-slate-300">
                <div className="font-semibold text-slate-100">{alert.title}</div>
                <div className="mt-2 text-xs text-slate-500">severity {alert.severity}</div>
                <div className="mt-3 rounded border border-slate-800 px-3 py-2">acknowledged: {String(alert.acknowledged)}</div>
              </div>
            ))}
        </article>
      </section>
    </main>
  );
}
