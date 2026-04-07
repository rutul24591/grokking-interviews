"use client";

import { useMemo, useState } from "react";
import { flows, principles } from "@/lib/store";

export default function Page() {
  const [selected, setSelected] = useState(0);
  const [contractsReal, setContractsReal] = useState(true);
  const [asyncBoundariesCovered, setAsyncBoundariesCovered] = useState(true);
  const [environmentParityHigh, setEnvironmentParityHigh] = useState(true);
  const flow = flows[selected];

  const decision = useMemo(() => {
    if (!contractsReal) return "Hold release. Contract stubs are too shallow for integration signoff.";
    if (!asyncBoundariesCovered) return "Do not sign off until callbacks and delayed state transitions are exercised.";
    if (!environmentParityHigh) return "Keep the suite under review until preview and CI mirror the release environment more closely.";
    if (flow.risk === "repair") return "Block shipment. The real production chain is still untested.";
    if (flow.risk === "watch") return "Review again after stateful session and delayed-boundary assertions are made real.";
    return "Integration coverage is acceptable for this flow. Maintain real contracts and state-transition evidence.";
  }, [asyncBoundariesCovered, contractsReal, environmentParityHigh, flow.risk]);

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-6 py-10 text-slate-100">
      <section className="rounded-3xl border border-slate-800 bg-slate-950/80 p-6">
        <p className="text-sm uppercase tracking-[0.25em] text-emerald-300">Frontend Testing Strategies</p>
        <h1 className="mt-2 text-3xl font-semibold">Integration testing release board</h1>
        <p className="mt-3 max-w-3xl text-sm text-slate-300">Inspect real service boundaries, delayed callbacks, and environment parity before releasing stateful frontend flows.</p>
        <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <article className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/70 p-5 text-sm text-slate-300">
            <select value={selected} onChange={(event) => setSelected(Number(event.target.value))} className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3">{flows.map((item, index) => <option key={item.id} value={index}>{item.label}</option>)}</select>
            <div className="grid gap-3 md:grid-cols-2">
              <label className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-950/80 p-3"><input type="checkbox" checked={contractsReal} onChange={(event) => setContractsReal(event.target.checked)} /> Real contract responses used</label>
              <label className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-950/80 p-3"><input type="checkbox" checked={asyncBoundariesCovered} onChange={(event) => setAsyncBoundariesCovered(event.target.checked)} /> Async boundaries covered</label>
              <label className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-950/80 p-3 md:col-span-2"><input type="checkbox" checked={environmentParityHigh} onChange={(event) => setEnvironmentParityHigh(event.target.checked)} /> Preview and CI environments stay aligned</label>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4"><div className="text-xs uppercase tracking-wide text-slate-500">Release decision</div><p className="mt-2">{decision}</p></div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4"><div className="text-xs uppercase tracking-wide text-slate-500">Flow snapshot</div><ul className="mt-2 space-y-2"><li><span className="font-medium text-slate-100">Owner:</span> {flow.owner}</li><li><span className="font-medium text-slate-100">Gate:</span> {flow.releaseGate}</li><li><span className="font-medium text-slate-100">Boundary:</span> {flow.boundary}</li></ul></div>
              <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4"><div className="text-xs uppercase tracking-wide text-slate-500">Assessment</div><p className="mt-2">{flow.finding}</p></div>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4"><div className="text-xs uppercase tracking-wide text-slate-500">Scenario matrix</div><ul className="mt-2 space-y-2">{flow.scenarios.map((item) => <li key={item}>• {item}</li>)}</ul></div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4"><div className="text-xs uppercase tracking-wide text-slate-500">Actions</div><ul className="mt-2 space-y-2">{flow.actions.map((item) => <li key={item}>• {item}</li>)}</ul></div>
          </article>
          <aside className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/70 p-5 text-sm text-slate-300"><div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4"><div className="text-xs uppercase tracking-wide text-slate-500">Integration principles</div><ul className="mt-2 space-y-2">{principles.map((item) => <li key={item}>• {item}</li>)}</ul></div></aside>
        </div>
      </section>
    </main>
  );
}
