"use client";

import { useMemo, useState } from "react";
import { rules, surfaces } from "@/lib/store";

export default function Page() {
  const [selected, setSelected] = useState(0);
  const [responsiveCoverageCurrent, setResponsiveCoverageCurrent] = useState(true);
  const [criticalStatesCovered, setCriticalStatesCovered] = useState(true);
  const [baselineIntentSignedOff, setBaselineIntentSignedOff] = useState(true);
  const surface = surfaces[selected];

  const decision = useMemo(() => {
    if (!responsiveCoverageCurrent) return "Do not approve. Missing viewport evidence makes the visual signal incomplete.";
    if (!criticalStatesCovered) return "Block release until loading, empty, and error states have screenshot baselines.";
    if (!baselineIntentSignedOff) return "Keep the diff open. Baseline refresh requires explicit product or design intent, not convenience approval.";
    if (surface.risk === "repair") return "Do not ship. A customer-visible state lacks visual regression protection.";
    if (surface.risk === "watch") return "Review again after stale breakpoints and missing states are refreshed.";
    return "Visual regression posture is acceptable. Keep baseline ownership strict and state-specific.";
  }, [baselineIntentSignedOff, criticalStatesCovered, responsiveCoverageCurrent, surface.risk]);

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-6 py-10 text-slate-100">
      <section className="rounded-3xl border border-slate-800 bg-slate-950/80 p-6">
        <p className="text-sm uppercase tracking-[0.25em] text-emerald-300">Frontend Testing Strategies</p>
        <h1 className="mt-2 text-3xl font-semibold">Visual regression review board</h1>
        <p className="mt-3 max-w-3xl text-sm text-slate-300">Inspect screenshot baseline quality, responsive coverage, and diff triage signals before approving UI changes.</p>
        <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <article className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/70 p-5 text-sm text-slate-300">
            <select value={selected} onChange={(event) => setSelected(Number(event.target.value))} className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3">{surfaces.map((item, index) => <option key={item.id} value={index}>{item.label}</option>)}</select>
            <div className="grid gap-3 md:grid-cols-2">
              <label className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-950/80 p-3"><input type="checkbox" checked={responsiveCoverageCurrent} onChange={(event) => setResponsiveCoverageCurrent(event.target.checked)} /> Responsive coverage current</label>
              <label className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-950/80 p-3"><input type="checkbox" checked={criticalStatesCovered} onChange={(event) => setCriticalStatesCovered(event.target.checked)} /> Critical states covered</label>
              <label className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-950/80 p-3 md:col-span-2"><input type="checkbox" checked={baselineIntentSignedOff} onChange={(event) => setBaselineIntentSignedOff(event.target.checked)} /> Baseline intent explicitly signed off</label>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4"><div className="text-xs uppercase tracking-wide text-slate-500">Release decision</div><p className="mt-2">{decision}</p></div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4"><div className="text-xs uppercase tracking-wide text-slate-500">Surface snapshot</div><ul className="mt-2 space-y-2"><li><span className="font-medium text-slate-100">Owner:</span> {surface.owner}</li><li><span className="font-medium text-slate-100">Gate:</span> {surface.releaseGate}</li><li><span className="font-medium text-slate-100">Baseline:</span> {surface.baseline}</li></ul></div>
              <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4"><div className="text-xs uppercase tracking-wide text-slate-500">Assessment</div><p className="mt-2">{surface.finding}</p></div>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4"><div className="text-xs uppercase tracking-wide text-slate-500">Scenario coverage</div><ul className="mt-2 space-y-2">{surface.scenarios.map((item) => <li key={item}>• {item}</li>)}</ul></div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4"><div className="text-xs uppercase tracking-wide text-slate-500">Actions</div><ul className="mt-2 space-y-2">{surface.actions.map((item) => <li key={item}>• {item}</li>)}</ul></div>
          </article>
          <aside className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/70 p-5 text-sm text-slate-300"><div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4"><div className="text-xs uppercase tracking-wide text-slate-500">Visual regression rules</div><ul className="mt-2 space-y-2">{rules.map((item) => <li key={item}>• {item}</li>)}</ul></div></aside>
        </div>
      </section>
    </main>
  );
}
