"use client";

import { useState } from "react";

type AnalyticsEvent = {
  type: string;
  articleId: string;
  metadata?: Record<string, string>;
};

export default function AnalyticsWorkbench() {
  const [consent, setConsent] = useState(true);
  const [queue, setQueue] = useState<AnalyticsEvent[]>([]);
  const [logs, setLogs] = useState<string[]>([]);

  function addEvent(event: AnalyticsEvent) {
    if (!consent) {
      setLogs((current) => [`dropped ${event.type} because consent is disabled`, ...current].slice(0, 8));
      return;
    }
    setQueue((current) => [...current, event]);
  }

  async function flushQueue() {
    const payload = queue.map((event) => ({
      ...event,
      metadata: Object.fromEntries(Object.entries(event.metadata ?? {}).filter(([key]) => key !== "email"))
    }));
    const response = await fetch("http://localhost:4471/collect", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ events: payload })
    });
    const result = (await response.json()) as { accepted: number };
    setLogs((current) => [`flushed ${result.accepted} analytics event(s)`, ...current].slice(0, 8));
    setQueue([]);
  }

  return (
    <section className="mt-8 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
      <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Tracker controls</h2>
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input checked={consent} onChange={() => setConsent((current) => !current)} type="checkbox" />
            Consent enabled
          </label>
        </div>
        <div className="mt-4 flex flex-wrap gap-3">
          <button onClick={() => addEvent({ type: "page_view", articleId: "oauth-integration" })} className="rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white">
            Track page view
          </button>
          <button onClick={() => addEvent({ type: "share_click", articleId: "oauth-integration", metadata: { channel: "linkedin", email: "reader@example.com" } })} className="rounded-full bg-indigo-100 px-4 py-2 text-sm font-semibold text-indigo-700">
            Track share click
          </button>
          <button onClick={() => void flushQueue()} className="rounded-full bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-700">
            Flush queue
          </button>
        </div>
        <p className="mt-4 text-sm text-slate-600">Queued events: {queue.length}</p>
      </article>

      <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold">Collector activity</h2>
        <ul className="mt-4 space-y-3 text-sm text-slate-700">
          {logs.map((log) => (
            <li key={log} className="rounded-2xl bg-slate-50 px-4 py-3">{log}</li>
          ))}
        </ul>
      </article>
    </section>
  );
}
