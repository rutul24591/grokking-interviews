"use client";

import { useEffect, useState } from "react";

type Monitor = {
  id: string;
  metric: string;
  value: string;
  status: "healthy" | "warning" | "critical";
  owner: string;
  updatedAt: string;
};

type MonitoringState = {
  sampleWindow: string;
  monitors: Monitor[];
  blindSpots: string[];
  lastMessage: string;
};

export default function Page() {
  const [state, setState] = useState<MonitoringState | null>(null);

  async function refresh() {
    const response = await fetch("/api/monitoring-tools/state");
    setState((await response.json()) as MonitoringState);
  }

  async function act(type: "expand-window" | "ack-critical", id?: string) {
    const response = await fetch("/api/monitoring-tools/action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, id })
    });
    setState((await response.json()) as MonitoringState);
  }

  useEffect(() => { void refresh(); }, []);

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="text-3xl font-bold">Monitoring Tools Surface</h1>
      <p className="mt-2 text-slate-300">Inspect moderation system health, widen the sample window, and acknowledge critical monitors without losing operator context.</p>
      <section className="mt-8 grid gap-6 lg:grid-cols-[320px,1fr]">
        <article className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 text-sm text-slate-300">
          <div className="text-xs uppercase tracking-wide text-slate-500">Sample window</div>
          <div className="mt-2 text-lg font-semibold text-slate-100">{state?.sampleWindow}</div>
          <button onClick={() => void act("expand-window")} className="mt-4 rounded bg-sky-600 px-4 py-2 text-sm font-semibold">Expand window</button>
          <p className="mt-4 text-slate-400">{state?.lastMessage}</p>
        </article>
        <article className="space-y-4">
          {state?.monitors.map((monitor) => (
            <div key={monitor.id} className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 text-sm text-slate-300">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="font-semibold text-slate-100">{monitor.metric}</div>
                  <div className="mt-1 text-xs text-slate-500">{monitor.value} · {monitor.status}</div>
                  <div className="mt-1 text-xs text-slate-500">owner {monitor.owner} · updated {monitor.updatedAt}</div>
                </div>
                <button onClick={() => void act("ack-critical", monitor.id)} className="rounded border border-slate-700 px-3 py-2 text-xs font-semibold">Acknowledge</button>
              </div>
            </div>
          ))}
          <div className="rounded-xl border border-dashed border-slate-700 bg-slate-950/50 p-5 text-sm text-slate-300">
            <div className="text-xs uppercase tracking-wide text-slate-500">Blind spots</div>
            <div className="mt-3 flex flex-wrap gap-2">
              {state?.blindSpots.map((spot) => (
                <span key={spot} className="rounded border border-slate-800 px-3 py-1 text-xs">{spot}</span>
              ))}
            </div>
          </div>
        </article>
      </section>
    </main>
  );
}
