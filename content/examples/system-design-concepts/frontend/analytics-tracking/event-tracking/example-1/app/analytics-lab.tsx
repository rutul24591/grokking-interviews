"use client";

import { useState } from "react";

type TrackedEvent = { type: string; articleId: string; value: number };
type FlushResponse = { accepted: string[]; rejected: string[] };

export default function AnalyticsLab() {
  const [queue, setQueue] = useState<TrackedEvent[]>([]);
  const [result, setResult] = useState<FlushResponse | null>(null);

  function push(type: string, value: number) {
    setQueue((current) => [...current, { type, articleId: "server-sent-events", value }]);
  }

  async function flush() {
    const response = await fetch("http://localhost:4514/collect", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ events: queue })
    });
    setResult((await response.json()) as FlushResponse);
    setQueue([]);
  }

  return (
    <section className="mt-8 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
      <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-950">Interaction queue</h2>
        <div className="mt-4 flex flex-wrap gap-3 text-sm">
          <button className="rounded-full bg-slate-950 px-4 py-2 font-semibold text-white" onClick={() => push("scroll_depth", 60)}>Track scroll 60%</button>
          <button className="rounded-full bg-indigo-100 px-4 py-2 font-semibold text-indigo-800" onClick={() => push("share_click", 1)}>Track share click</button>
          <button className="rounded-full bg-rose-100 px-4 py-2 font-semibold text-rose-800" onClick={() => push("invalid", 0)}>Track invalid event</button>
          <button className="rounded-full bg-emerald-100 px-4 py-2 font-semibold text-emerald-800" onClick={() => void flush()}>Flush queue</button>
        </div>
        <ul className="mt-4 space-y-3 text-sm text-slate-700">
          {queue.map((event, index) => (
            <li key={`${event.type}-${index}`} className="rounded-2xl bg-slate-50 px-4 py-3">{event.type} · {event.articleId} · value {event.value}</li>
          ))}
        </ul>
      </article>

      <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-950">Collector verdict</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl bg-emerald-50 p-4 text-sm text-emerald-900">
            <p className="font-semibold">Accepted</p>
            <ul className="mt-3 space-y-2">{result?.accepted.map((entry) => <li key={entry}>{entry}</li>)}</ul>
          </div>
          <div className="rounded-2xl bg-rose-50 p-4 text-sm text-rose-900">
            <p className="font-semibold">Rejected</p>
            <ul className="mt-3 space-y-2">{result?.rejected.map((entry) => <li key={entry}>{entry}</li>)}</ul>
          </div>
        </div>
      </article>
    </section>
  );
}
