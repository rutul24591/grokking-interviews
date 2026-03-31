"use client";

import { useEffect, useState } from "react";

type MetricReport = { totals: Record<string, number>; accepted: number; rejected: number; recent: string[] };

const initialPayload = { event: "article_view", plan: "staff-plus", device: "desktop", article: "request-batching", cohort: "spring-2026" };

export default function AnalyticsLab() {
  const [payload, setPayload] = useState(initialPayload);
  const [report, setReport] = useState<MetricReport | null>(null);

  async function refresh() {
    const response = await fetch("http://localhost:4513/report");
    setReport((await response.json()) as MetricReport);
  }

  useEffect(() => {
    void refresh();
  }, []);

  async function sendEvent() {
    await fetch("http://localhost:4513/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    await refresh();
  }

  return (
    <section className="mt-8 grid gap-6 lg:grid-cols-[1fr_1fr]">
      <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-950">Dimension payload</h2>
        <div className="mt-4 grid gap-3">
          {Object.entries(payload).map(([key, value]) => (
            <label key={key} className="grid gap-1 text-sm text-slate-700">
              <span className="font-medium capitalize">{key}</span>
              <input className="rounded-2xl border border-slate-200 px-3 py-2" value={value} onChange={(event) => setPayload((current) => ({ ...current, [key]: event.target.value }))} />
            </label>
          ))}
        </div>
        <button className="mt-5 rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white" onClick={() => void sendEvent()}>Track event</button>
      </article>

      <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-950">Aggregation output</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {Object.entries(report?.totals ?? {}).map(([key, value]) => (
            <div key={key} className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-700">
              <p className="font-semibold text-slate-950">{key}</p>
              <p className="mt-2">{value} accepted events</p>
            </div>
          ))}
        </div>
        <p className="mt-4 text-sm text-slate-600">Accepted: {report?.accepted ?? 0} · Rejected: {report?.rejected ?? 0}</p>
        <ul className="mt-4 space-y-3 text-sm text-slate-700">
          {report?.recent.map((entry) => <li key={entry} className="rounded-2xl bg-indigo-50 px-4 py-3">{entry}</li>)}
        </ul>
      </article>
    </section>
  );
}
