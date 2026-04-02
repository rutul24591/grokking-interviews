"use client";

import { useEffect, useState } from "react";

type TrackedEvent = {
  id: string;
  event: string;
  entity: string;
  status: "queued" | "sent" | "dropped";
};

type TrackingState = {
  mode: "immediate" | "batched";
  events: TrackedEvent[];
  lastMessage: string;
};

export default function Page() {
  const [state, setState] = useState<TrackingState | null>(null);

  async function refresh() {
    const response = await fetch("/api/engagement-tracking/state");
    setState((await response.json()) as TrackingState);
  }

  async function act(type: "switch-mode" | "emit-event", value?: string) {
    const response = await fetch("/api/engagement-tracking/action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, value })
    });
    setState((await response.json()) as TrackingState);
  }

  useEffect(() => {
    void refresh();
  }, []);

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="text-3xl font-bold">Engagement Tracking</h1>
      <p className="mt-2 text-slate-300">Switch event delivery mode, emit engagement events, and inspect tracking outcomes before analytics consume them.</p>
      <section className="mt-8 grid gap-6 lg:grid-cols-[320px,1fr]">
        <article className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 text-sm text-slate-300">
          <div className="flex flex-wrap gap-3">
            <button onClick={() => void act("switch-mode", "immediate")} className="rounded bg-sky-600 px-4 py-2 text-sm font-semibold">Immediate</button>
            <button onClick={() => void act("switch-mode", "batched")} className="rounded border border-slate-700 px-4 py-2 text-sm font-semibold">Batched</button>
          </div>
          <button onClick={() => void act("emit-event", "like")} className="mt-4 rounded border border-slate-700 px-4 py-2 text-sm font-semibold">Emit like event</button>
          <p className="mt-4 text-slate-400">{state?.lastMessage}</p>
        </article>
        <article className="space-y-4">
          {state?.events.map((event) => (
            <div key={event.id} className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 text-sm text-slate-300">
              <div className="font-semibold text-slate-100">{event.event}</div>
              <div className="mt-1 text-xs text-slate-500">{event.entity}</div>
              <div className="mt-3 rounded border border-slate-800 px-3 py-2">status: {event.status}</div>
            </div>
          ))}
        </article>
      </section>
    </main>
  );
}
