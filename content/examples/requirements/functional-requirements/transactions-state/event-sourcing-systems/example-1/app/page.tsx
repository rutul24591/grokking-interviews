"use client";

import { useEffect, useState } from "react";

type EventRecord = { id: string; type: string; entityId: string; sequence: number };
type PageState = {
  snapshotVersion: number;
  replayLag: number;
  projection: { orderId: string; status: string };
  events: EventRecord[];
  lastMessage: string;
};

export default function Page() {
  const [state, setState] = useState<PageState | null>(null);

  async function refresh() {
    const response = await fetch("/api/event-sourcing-systems/state");
    setState((await response.json()) as PageState);
  }

  async function append(value: "payment-authorized" | "payment-captured" | "refund-issued") {
    const response = await fetch("/api/event-sourcing-systems/action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "append-event", value })
    });
    setState((await response.json()) as PageState);
  }

  useEffect(() => { void refresh(); }, []);

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="text-3xl font-bold">Event Sourcing Systems</h1>
      <p className="mt-2 text-slate-300">Append transaction events, rebuild current order state, and watch replay lag shrink as snapshots advance.</p>
      <section className="mt-8 grid gap-6 lg:grid-cols-[320px,1fr]">
        <article className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 text-sm text-slate-300">
          <div className="grid gap-3">
            <button onClick={() => void append("payment-authorized")} className="rounded bg-sky-600 px-4 py-2 text-sm font-semibold">Authorize</button>
            <button onClick={() => void append("payment-captured")} className="rounded border border-slate-700 px-4 py-2 text-sm font-semibold">Capture</button>
            <button onClick={() => void append("refund-issued")} className="rounded border border-slate-700 px-4 py-2 text-sm font-semibold">Refund</button>
          </div>
          <div className="mt-5 grid gap-3 text-xs text-slate-400">
            <div className="rounded border border-slate-800 px-3 py-2">snapshot version: {state?.snapshotVersion}</div>
            <div className="rounded border border-slate-800 px-3 py-2">replay lag: {state?.replayLag}</div>
            <div className="rounded border border-slate-800 px-3 py-2">projection status: {state?.projection.status}</div>
          </div>
          <p className="mt-4 text-slate-400">{state?.lastMessage}</p>
        </article>
        <article className="space-y-3">
          {state?.events.map((event) => (
            <div key={event.id} className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 text-sm text-slate-300">
              <div className="font-semibold text-slate-100">{event.type}</div>
              <div className="mt-1 text-xs text-slate-500">{event.entityId} · sequence {event.sequence}</div>
            </div>
          ))}
        </article>
      </section>
    </main>
  );
}
