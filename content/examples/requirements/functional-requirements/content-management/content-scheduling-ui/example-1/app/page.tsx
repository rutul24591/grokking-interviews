"use client";
import { useEffect, useState } from "react";

type ScheduledEntry = {
  id: string;
  title: string;
  scheduledFor: string;
  timezone: string;
  readiness: "ready" | "blocked" | "warning";
};
type SchedulingState = {
  releaseWindow: string;
  entries: ScheduledEntry[];
  lastMessage: string;
};

export default function Page() {
  const [state, setState] = useState<SchedulingState | null>(null);
  async function refresh() {
    const response = await fetch("/api/scheduling/state");
    setState((await response.json()) as SchedulingState);
  }
  async function setReadiness(id: string, readiness: ScheduledEntry["readiness"]) {
    const response = await fetch("/api/scheduling/publish", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, readiness })
    });
    setState((await response.json()) as SchedulingState);
  }
  useEffect(() => { void refresh(); }, []);
  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="text-3xl font-bold">Content Scheduling UI</h1>
      <p className="mt-2 text-slate-300">Review scheduled publication times, timezone alignment, and editorial readiness before automated release.</p>
      <section className="mt-8 grid gap-6 lg:grid-cols-[320px,1fr]">
        <article className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 text-sm text-slate-300">
          <div className="rounded-lg border border-slate-800 p-4">
            <div className="text-xs uppercase tracking-wide text-slate-500">Release window</div>
            <div className="mt-2 font-semibold text-slate-100">{state?.releaseWindow}</div>
          </div>
          <p className="mt-4 text-slate-400">{state?.lastMessage}</p>
        </article>
        <article className="space-y-4">
          {state?.entries.map((entry) => (
            <div key={entry.id} className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 text-sm text-slate-300">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="font-semibold text-slate-100">{entry.title}</div>
                  <div className="mt-1 text-xs uppercase tracking-wide text-slate-500">{entry.timezone}</div>
                </div>
                <select value={entry.readiness} onChange={(event) => void setReadiness(entry.id, event.target.value as ScheduledEntry["readiness"])} className="rounded border border-slate-700 bg-slate-950 px-3 py-2">
                  <option value="ready">ready</option>
                  <option value="warning">warning</option>
                  <option value="blocked">blocked</option>
                </select>
              </div>
              <div className="mt-3 rounded border border-slate-800 px-3 py-3">Scheduled for: {entry.scheduledFor}</div>
            </div>
          ))}
        </article>
      </section>
    </main>
  );
}
