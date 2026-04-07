"use client";

import { useMemo, useState } from "react";
import { cutovers, recoveryLanes } from "@/lib/store";

export default function Page() {
  const [selected, setSelected] = useState(0);
  const [parityApproved, setParityApproved] = useState(true);
  const [rollbackArmed, setRollbackArmed] = useState(true);
  const [trafficExpanded, setTrafficExpanded] = useState(false);
  const cutover = cutovers[selected];

  const releaseDecision = useMemo(() => {
    if (!rollbackArmed) {
      return "Block cutover. Blue-green loses its value if the old stack cannot take traffic immediately.";
    }
    if (!parityApproved) {
      return "Hold promotion. Restore parity across env vars, assets, and traffic policy before moving any more customers.";
    }
    if (cutover.risk === "repair") {
      return "Rollback now. Route all customers back to blue and quarantine the green stack for incident review.";
    }
    if (cutover.risk === "watch" || !trafficExpanded) {
      return "Stay on the current traffic weight, keep blue warm, and expand only after the scenario-specific signals remain clean.";
    }
    return "Expand green traffic while blue stays hot as the rollback lane and continue checking business metrics, not only infrastructure health.";
  }, [cutover.risk, parityApproved, rollbackArmed, trafficExpanded]);

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-6 py-10 text-slate-100">
      <section className="rounded-3xl border border-slate-800 bg-slate-950/80 p-6">
        <p className="text-sm uppercase tracking-[0.25em] text-emerald-300">Frontend Build &amp; Deployment</p>
        <h1 className="mt-2 text-3xl font-semibold">Blue-green environment cutover review</h1>
        <p className="mt-3 max-w-3xl text-sm text-slate-300">
          Review parity, traffic weights, and rollback readiness before sending more users to the green environment.
        </p>
        <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <article className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/70 p-5 text-sm text-slate-300">
            <select
              value={selected}
              onChange={(event) => setSelected(Number(event.target.value))}
              className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3"
            >
              {cutovers.map((item, index) => (
                <option key={item.id} value={index}>
                  {item.label}
                </option>
              ))}
            </select>
            <div className="grid gap-3 md:grid-cols-2">
              <label className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-950/80 p-3">
                <input type="checkbox" checked={parityApproved} onChange={(event) => setParityApproved(event.target.checked)} />
                Parity checklist approved
              </label>
              <label className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-950/80 p-3">
                <input type="checkbox" checked={rollbackArmed} onChange={(event) => setRollbackArmed(event.target.checked)} />
                Blue rollback is armed
              </label>
              <label className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-950/80 p-3 md:col-span-2">
                <input type="checkbox" checked={trafficExpanded} onChange={(event) => setTrafficExpanded(event.target.checked)} />
                Expand traffic beyond the current weight
              </label>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
              <div className="text-xs uppercase tracking-wide text-slate-500">Cutover decision</div>
              <p className="mt-2">{releaseDecision}</p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
                <div className="text-xs uppercase tracking-wide text-slate-500">Environment snapshot</div>
                <ul className="mt-2 space-y-2">
                  <li><span className="font-medium text-slate-100">Blue:</span> {cutover.blueVersion}</li>
                  <li><span className="font-medium text-slate-100">Green:</span> {cutover.greenVersion}</li>
                  <li><span className="font-medium text-slate-100">Weight:</span> {cutover.routeWeight}</li>
                  <li><span className="font-medium text-slate-100">Parity:</span> {cutover.parity}</li>
                </ul>
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
                <div className="text-xs uppercase tracking-wide text-slate-500">Customer-facing signal</div>
                <p className="mt-2">{cutover.customerSignal}</p>
                <p className="mt-3 text-xs text-slate-400">Rollback objective: {cutover.rollbackSlo}</p>
              </div>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
              <div className="text-xs uppercase tracking-wide text-slate-500">Cutover tasks</div>
              <ul className="mt-2 space-y-2">
                {cutover.tasks.map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
            </div>
          </article>
          <aside className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/70 p-5 text-sm text-slate-300">
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
              <div className="text-xs uppercase tracking-wide text-slate-500">Operational checkpoints</div>
              <ul className="mt-2 space-y-2">
                {cutover.checkpoints.map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
              <div className="text-xs uppercase tracking-wide text-slate-500">Recovery lanes</div>
              <ul className="mt-2 space-y-2">
                {recoveryLanes.map((item) => (
                  <li key={item.trigger}>
                    <span className="font-medium text-slate-100">{item.trigger}:</span> {item.action}
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
