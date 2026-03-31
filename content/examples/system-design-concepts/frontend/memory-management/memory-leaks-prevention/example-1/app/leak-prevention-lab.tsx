"use client";

import { useEffect, useState } from "react";

type Bucket = { sourceId: string; label: string; retained: number; note: string };
type LeakState = {
  retained: number;
  budgetStatus: "within-budget" | "warning" | "critical";
  cycle: number;
  buckets: Bucket[];
  notes: string[];
};

export default function LeakPreventionLab() {
  const [state, setState] = useState<LeakState | null>(null);
  const [selectedSource, setSelectedSource] = useState("cache");

  async function refresh() {
    const response = await fetch("http://localhost:4534/state");
    const next = (await response.json()) as LeakState;
    setState(next);
    setSelectedSource((current) => current || next.buckets[0]?.sourceId || "cache");
  }

  useEffect(() => {
    void refresh();
  }, []);

  async function run(actionId: string, sourceId = selectedSource) {
    await fetch("http://localhost:4534/action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ actionId, sourceId })
    });
    await refresh();
  }

  const tone = state?.budgetStatus === "critical" ? "text-rose-700 bg-rose-50" : state?.budgetStatus === "warning" ? "text-amber-700 bg-amber-50" : "text-emerald-700 bg-emerald-50";

  return (
    <section className="mt-8 grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
      <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-950">Long-session leak triage</h2>
        <select className="mt-4 w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm" value={selectedSource} onChange={(event) => setSelectedSource(event.target.value)}>
          {state?.buckets.map((bucket) => <option key={bucket.sourceId} value={bucket.sourceId}>{bucket.label}</option>)}
        </select>
        <div className="flex flex-wrap gap-2 text-sm">
          <button className="rounded-full bg-rose-100 px-4 py-2 font-semibold text-rose-800" onClick={() => void run("grow-session")}>Advance session</button>
          <button className="rounded-full bg-indigo-100 px-4 py-2 font-semibold text-indigo-800" onClick={() => void run("grow-source")}>Stress selected source</button>
          <button className="rounded-full bg-slate-950 px-4 py-2 font-semibold text-white" onClick={() => void run("cleanup-source")}>Cleanup selected</button>
          <button className="rounded-full bg-emerald-100 px-4 py-2 font-semibold text-emerald-800" onClick={() => void run("cleanup-all")}>Cleanup all</button>
          <button className="rounded-full bg-emerald-100 px-4 py-2 font-semibold text-emerald-800" onClick={() => void run("reset")}>Reset</button>
        </div>
        <div className="mt-4 flex items-center gap-3 text-sm text-slate-700">
          <p>Retained objects: <span className="font-semibold text-slate-950">{state?.retained ?? 0}</span></p>
          <span className={`rounded-full px-3 py-1 font-semibold ${tone}`}>{state?.budgetStatus ?? "within-budget"}</span>
          <span>Session cycle {state?.cycle ?? 1}</span>
        </div>
        <ul className="mt-4 space-y-2 text-sm text-slate-700">{state?.notes.map((note) => <li key={note}>• {note}</li>)}</ul>
      </article>
      <article className="grid gap-3 sm:grid-cols-2">
        {state?.buckets.map((bucket) => (
          <div key={bucket.sourceId} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-sm font-semibold text-slate-950">{bucket.label}</p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">{bucket.retained}</p>
            <p className="mt-2 text-xs leading-5 text-slate-500">{bucket.note}</p>
          </div>
        ))}
      </article>
    </section>
  );
}
