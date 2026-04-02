"use client";

import { useEffect, useState } from "react";

type Alert = { id: string; title: string; severity: "low" | "medium" | "high"; acknowledged: boolean };

type AlertState = {
  channel: string;
  alerts: Alert[];
  noiseBudget: number;
  lastMessage: string;
};

export default function Page() {
  const [state, setState] = useState<AlertState | null>(null);

  async function refresh() {
    const response = await fetch("/api/alerting/state");
    setState((await response.json()) as AlertState);
  }

  async function act(type: "ack" | "tighten-noise", id?: string) {
    const response = await fetch("/api/alerting/action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, id })
    });
    setState((await response.json()) as AlertState);
  }

  useEffect(() => { void refresh(); }, []);

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="text-3xl font-bold">Alerting Systems</h1>
      <p className="mt-2 text-slate-300">Route moderation alerts by severity, acknowledge active incidents, and tune noise budget to reduce alert fatigue.</p>
      <section className="mt-8 grid gap-6 lg:grid-cols-[320px,1fr]">
        <article className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 text-sm text-slate-300">
          <div className="text-xs uppercase tracking-wide text-slate-500">Primary channel</div>
          <div className="mt-2 text-lg font-semibold text-slate-100">{state?.channel}</div>
          <div className="mt-2">Noise budget: {state?.noiseBudget}</div>
          <button onClick={() => void act("tighten-noise")} className="mt-4 rounded bg-sky-600 px-4 py-2 text-sm font-semibold">Tighten noise budget</button>
          <p className="mt-4 text-slate-400">{state?.lastMessage}</p>
        </article>
        <article className="space-y-4">
          {state?.alerts.map((alert) => (
            <div key={alert.id} className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 text-sm text-slate-300">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="font-semibold text-slate-100">{alert.title}</div>
                  <div className="mt-1 text-xs text-slate-500">severity {alert.severity}</div>
                </div>
                <button onClick={() => void act("ack", alert.id)} className="rounded border border-slate-700 px-3 py-2 text-xs font-semibold">Acknowledge</button>
              </div>
              <div className="mt-3 rounded border border-slate-800 px-3 py-2">acknowledged: {String(alert.acknowledged)}</div>
            </div>
          ))}
        </article>
      </section>
    </main>
  );
}
