"use client";

import { useEffect, useState } from "react";

type Report = {
  id: string;
  reason: string;
  target: string;
  status: "new" | "triaged" | "resolved";
  reportCount: number;
  queueHint: string;
};

type ReportingState = {
  reviewer: string;
  reports: Report[];
  lastMessage: string;
};

export default function Page() {
  const [state, setState] = useState<ReportingState | null>(null);

  async function refresh() {
    const response = await fetch("/api/reporting-tools/state");
    setState((await response.json()) as ReportingState);
  }

  async function act(type: "rotate-reviewer" | "triage-report", id?: string) {
    const response = await fetch("/api/reporting-tools/action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, id })
    });
    setState((await response.json()) as ReportingState);
  }

  useEffect(() => { void refresh(); }, []);

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="text-3xl font-bold">Reporting Tools UI</h1>
      <p className="mt-2 text-slate-300">Review inbound user reports, rotate ownership, and triage harm categories before they enter moderation queues.</p>
      <section className="mt-8 grid gap-6 lg:grid-cols-[320px,1fr]">
        <article className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 text-sm text-slate-300">
          <div className="text-xs uppercase tracking-wide text-slate-500">Reviewer</div>
          <div className="mt-2 text-lg font-semibold text-slate-100">{state?.reviewer}</div>
          <button onClick={() => void act("rotate-reviewer")} className="mt-4 rounded bg-sky-600 px-4 py-2 text-sm font-semibold">Rotate reviewer</button>
          <p className="mt-4 text-slate-400">{state?.lastMessage}</p>
        </article>
        <article className="space-y-4">
          {state?.reports.map((report) => (
            <div key={report.id} className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 text-sm text-slate-300">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="font-semibold text-slate-100">{report.reason}</div>
                  <div className="mt-1 text-xs text-slate-500">{report.target} · {report.status}</div>
                  <div className="mt-1 text-xs text-slate-500">{report.reportCount} reports · queue {report.queueHint}</div>
                </div>
                <button onClick={() => void act("triage-report", report.id)} className="rounded border border-slate-700 px-3 py-2 text-xs font-semibold">Triage</button>
              </div>
            </div>
          ))}
        </article>
      </section>
    </main>
  );
}
