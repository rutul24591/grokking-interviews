"use client";

import { useEffect, useState } from "react";

type SeriesPoint = { label: string; value: number };

type AnalyticsState = {
  cohort: "today" | "week" | "month";
  throughput: SeriesPoint[];
  falsePositives: SeriesPoint[];
  cohortRisks: SeriesPoint[];
  lastMessage: string;
};

export default function Page() {
  const [state, setState] = useState<AnalyticsState | null>(null);

  async function refresh() {
    const response = await fetch("/api/analytics-admin/state");
    setState((await response.json()) as AnalyticsState);
  }

  async function switchCohort(cohort: AnalyticsState["cohort"]) {
    const response = await fetch("/api/analytics-admin/action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cohort })
    });
    setState((await response.json()) as AnalyticsState);
  }

  useEffect(() => { void refresh(); }, []);

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="text-3xl font-bold">Moderation Analytics Dashboard</h1>
      <p className="mt-2 text-slate-300">Switch between cohorts and inspect throughput and false-positive trends for moderation operations.</p>
      <section className="mt-8 grid gap-6 lg:grid-cols-[320px,1fr]">
        <article className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 text-sm text-slate-300">
          <div className="flex flex-wrap gap-3">
            <button onClick={() => void switchCohort("today")} className="rounded bg-sky-600 px-4 py-2 text-sm font-semibold">Today</button>
            <button onClick={() => void switchCohort("week")} className="rounded border border-slate-700 px-4 py-2 text-sm font-semibold">Week</button>
            <button onClick={() => void switchCohort("month")} className="rounded border border-slate-700 px-4 py-2 text-sm font-semibold">Month</button>
          </div>
          <p className="mt-4 text-slate-400">{state?.lastMessage}</p>
        </article>
        <article className="grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 text-sm text-slate-300">
            <div className="text-xs uppercase tracking-wide text-slate-500">Throughput</div>
            <div className="mt-4 space-y-2">
              {state?.throughput.map((point) => (
                <div key={point.label} className="rounded border border-slate-800 px-3 py-2">{point.label}: {point.value}</div>
              ))}
            </div>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 text-sm text-slate-300">
            <div className="text-xs uppercase tracking-wide text-slate-500">False positives</div>
            <div className="mt-4 space-y-2">
              {state?.falsePositives.map((point) => (
                <div key={point.label} className="rounded border border-slate-800 px-3 py-2">{point.label}: {point.value}</div>
              ))}
            </div>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 text-sm text-slate-300">
            <div className="text-xs uppercase tracking-wide text-slate-500">Hidden cohort risks</div>
            <div className="mt-4 space-y-2">
              {state?.cohortRisks.map((point) => (
                <div key={point.label} className="rounded border border-slate-800 px-3 py-2">{point.label}: {point.value}</div>
              ))}
            </div>
          </div>
        </article>
      </section>
    </main>
  );
}
