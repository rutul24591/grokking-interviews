"use client";

import { useMemo, useState } from "react";
import { expectations, journeys } from "@/lib/store";

export default function Page() {
  const [selected, setSelected] = useState(0);
  const [envFidelityHigh, setEnvFidelityHigh] = useState(true);
  const [asyncCompletionCovered, setAsyncCompletionCovered] = useState(true);
  const [seedDataStable, setSeedDataStable] = useState(true);
  const journey = journeys[selected];

  const decision = useMemo(() => {
    if (!envFidelityHigh) return "Do not sign off. The E2E environment diverges too far from production.";
    if (!asyncCompletionCovered) return "Hold release until delayed confirmations and retries are exercised.";
    if (!seedDataStable) return "Keep the suite under review until seeded customer data is isolated and repeatable.";
    if (journey.risk === "repair") return "Block shipment. This journey stops before the real production outcome.";
    if (journey.risk === "watch") return "Review again after every customer-facing step is exercised without bypasses.";
    return "E2E journey coverage is acceptable. Keep fidelity and business-outcome assertions intact.";
  }, [asyncCompletionCovered, envFidelityHigh, journey.risk, seedDataStable]);

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-6 py-10 text-slate-100">
      <section className="rounded-3xl border border-slate-800 bg-slate-950/80 p-6">
        <p className="text-sm uppercase tracking-[0.25em] text-emerald-300">Frontend Testing Strategies</p>
        <h1 className="mt-2 text-3xl font-semibold">End-to-end testing review board</h1>
        <p className="mt-3 max-w-3xl text-sm text-slate-300">Review full customer journeys, external-service fidelity, and release blockers for E2E coverage.</p>
        <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <article className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/70 p-5 text-sm text-slate-300">
            <select value={selected} onChange={(event) => setSelected(Number(event.target.value))} className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3">{journeys.map((item, index) => <option key={item.id} value={index}>{item.label}</option>)}</select>
            <div className="grid gap-3 md:grid-cols-2">
              <label className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-950/80 p-3"><input type="checkbox" checked={envFidelityHigh} onChange={(event) => setEnvFidelityHigh(event.target.checked)} /> Environment fidelity is high</label>
              <label className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-950/80 p-3"><input type="checkbox" checked={asyncCompletionCovered} onChange={(event) => setAsyncCompletionCovered(event.target.checked)} /> Async completion covered</label>
              <label className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-950/80 p-3 md:col-span-2"><input type="checkbox" checked={seedDataStable} onChange={(event) => setSeedDataStable(event.target.checked)} /> Seed data is stable across runs</label>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4"><div className="text-xs uppercase tracking-wide text-slate-500">Release decision</div><p className="mt-2">{decision}</p></div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4"><div className="text-xs uppercase tracking-wide text-slate-500">Journey snapshot</div><ul className="mt-2 space-y-2"><li><span className="font-medium text-slate-100">Owner:</span> {journey.owner}</li><li><span className="font-medium text-slate-100">Gate:</span> {journey.releaseGate}</li><li><span className="font-medium text-slate-100">Fidelity:</span> {journey.fidelity}</li></ul></div>
              <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4"><div className="text-xs uppercase tracking-wide text-slate-500">Assessment</div><p className="mt-2">{journey.finding}</p></div>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4"><div className="text-xs uppercase tracking-wide text-slate-500">Journey states</div><ul className="mt-2 space-y-2">{journey.scenarios.map((item) => <li key={item}>• {item}</li>)}</ul></div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4"><div className="text-xs uppercase tracking-wide text-slate-500">Actions</div><ul className="mt-2 space-y-2">{journey.actions.map((item) => <li key={item}>• {item}</li>)}</ul></div>
          </article>
          <aside className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/70 p-5 text-sm text-slate-300"><div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4"><div className="text-xs uppercase tracking-wide text-slate-500">E2E expectations</div><ul className="mt-2 space-y-2">{expectations.map((item) => <li key={item}>• {item}</li>)}</ul></div></aside>
        </div>
      </section>
    </main>
  );
}
