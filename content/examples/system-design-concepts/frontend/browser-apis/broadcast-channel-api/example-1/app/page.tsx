"use client";

import { useMemo, useState } from "react";
import { playbook, recovery, scenarios } from "@/lib/store";

export default function Page() {
  const [selected, setSelected] = useState(0);
  const [flagA, setFlagA] = useState(true);
  const [flagB, setFlagB] = useState(false);
  const scenario = scenarios[selected];

  const decision = useMemo(() => {
    if (scenario.status === "repair") return scenario.decision + " " + scenario.fallback;
    if (scenario.status === "watch") return flagB ? scenario.decision + " Escalate the degraded path immediately." : scenario.decision;
    return flagA ? scenario.decision : "Keep the baseline flow, but do not enable optional browser-API optimizations until the review passes.";
  }, [flagA, flagB, scenario]);

  const snapshot = useMemo(() => [
    { label: "Signal", value: scenario.signal, note: scenario.surface },
    { label: "Budget", value: scenario.budget, note: scenario.status },
    { label: "Fallback", value: scenario.fallback, note: scenario.label }
  ], [scenario]);

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-6 py-10 text-slate-100">
      <section className="rounded-3xl border border-slate-800 bg-slate-950/80 p-6">
        <p className="text-sm uppercase tracking-[0.25em] text-cyan-300">Browser APIs</p>
        <h1 className="mt-2 text-3xl font-semibold">Broadcast channel split-brain review</h1>
        <p className="mt-3 max-w-3xl text-sm text-slate-300">Review leader election, unsent cross-tab work, and stale-tab quarantine for Broadcast Channel based coordination.</p>
        <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <article className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/70 p-5 text-sm text-slate-300">
            <select value={selected} onChange={(event) => setSelected(Number(event.target.value))} className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3">
              {scenarios.map((item, index) => <option key={item.id} value={index}>{item.label}</option>)}
            </select>
            <div className="grid gap-3 md:grid-cols-2">
              <label className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-950/80 p-3"><input type="checkbox" checked={flagA} onChange={(event) => setFlagA(event.target.checked)} /> Promote visible tab as leader</label>
              <label className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-950/80 p-3"><input type="checkbox" checked={flagB} onChange={(event) => setFlagB(event.target.checked)} /> Quarantine stale participants</label>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
              <div className="text-xs uppercase tracking-wide text-slate-500">Coordination decision</div>
              <p className="mt-2">{decision}</p>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
              <div className="text-xs uppercase tracking-wide text-slate-500">Channel participants</div>
              <ul className="mt-2 space-y-2">{snapshot.map((item) => <li key={item.label}><span className="font-medium text-slate-100">{item.label}:</span> {item.value} · {item.note}</li>)}</ul>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
              <div className="text-xs uppercase tracking-wide text-slate-500">Coordination status</div>
              <ul className="mt-2 space-y-2">{scenario.tasks.map((item) => <li key={item}>• {item}</li>)}</ul>
            </div>
          </article>
          <aside className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/70 p-5 text-sm text-slate-300">
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
              <div className="text-xs uppercase tracking-wide text-slate-500">Scenario headline</div>
              <p className="mt-2">{scenario.headline}</p>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
              <div className="text-xs uppercase tracking-wide text-slate-500">Playbook</div>
              <ul className="mt-2 space-y-2">{playbook.map((item) => <li key={item}>• {item}</li>)}</ul>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
              <div className="text-xs uppercase tracking-wide text-slate-500">Recovery lanes</div>
              <ul className="mt-2 space-y-2">{recovery.map((item) => <li key={item.issue}><span className="font-medium text-slate-100">{item.issue}:</span> {item.action}</li>)}</ul>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
