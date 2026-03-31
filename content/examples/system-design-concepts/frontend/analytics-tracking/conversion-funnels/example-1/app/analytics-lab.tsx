"use client";

import { useEffect, useState } from "react";

type FunnelStage = { stage: string; users: number; conversionFromPrevious: number };
type FunnelResponse = { scenario: string; stages: FunnelStage[]; notes: string[] };

export default function AnalyticsLab() {
  const [scenario, setScenario] = useState("healthy");
  const [report, setReport] = useState<FunnelResponse | null>(null);
  const [logs, setLogs] = useState<string[]>([]);

  async function loadReport(nextScenario = scenario) {
    const response = await fetch(`http://localhost:4511/report?scenario=${nextScenario}`);
    setReport((await response.json()) as FunnelResponse);
  }

  useEffect(() => {
    void loadReport();
  }, []);

  async function simulate(nextScenario: string) {
    await fetch("http://localhost:4511/simulate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ scenario: nextScenario })
    });
    setScenario(nextScenario);
    setLogs((current) => [`loaded ${nextScenario} funnel traffic`, ...current].slice(0, 6));
    await loadReport(nextScenario);
  }

  async function recordCheckout() {
    await fetch("http://localhost:4511/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stage: "checkout", delta: 12 })
    });
    setLogs((current) => ["recorded 12 recovered checkouts", ...current].slice(0, 6));
    await loadReport();
  }

  return (
    <section className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold text-slate-950">Funnel stages</h2>
            <p className="text-sm text-slate-600">Scenario: {scenario}</p>
          </div>
          <div className="flex gap-2 text-sm">
            <button className="rounded-full bg-emerald-100 px-4 py-2 font-semibold text-emerald-800" onClick={() => void simulate("healthy")}>Healthy traffic</button>
            <button className="rounded-full bg-amber-100 px-4 py-2 font-semibold text-amber-800" onClick={() => void simulate("pricing-dropoff")}>Pricing drop-off</button>
            <button className="rounded-full bg-slate-950 px-4 py-2 font-semibold text-white" onClick={() => void recordCheckout()}>Recover checkouts</button>
          </div>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          {report?.stages.map((stage) => (
            <div key={stage.stage} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">{stage.stage}</p>
              <p className="mt-3 text-3xl font-semibold text-slate-950">{stage.users}</p>
              <p className="mt-2 text-sm text-slate-600">{stage.conversionFromPrevious}% from previous stage</p>
            </div>
          ))}
        </div>
      </article>

      <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-950">Operator notes</h2>
        <ul className="mt-4 space-y-3 text-sm text-slate-700">
          {report?.notes.map((note) => <li key={note} className="rounded-2xl bg-indigo-50 px-4 py-3">{note}</li>)}
          {logs.map((log) => <li key={log} className="rounded-2xl bg-slate-50 px-4 py-3">{log}</li>)}
        </ul>
      </article>
    </section>
  );
}
