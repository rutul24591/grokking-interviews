"use client";

import { useMemo, useState } from "react";
import { heuristics, modules } from "@/lib/store";

export default function Page() {
  const [selected, setSelected] = useState(0);
  const [mocksIsolated, setMocksIsolated] = useState(true);
  const [branchCoverageGreen, setBranchCoverageGreen] = useState(true);
  const [mutationChecksEnabled, setMutationChecksEnabled] = useState(true);
  const review = modules[selected];

  const decision = useMemo(() => {
    if (!mocksIsolated) {
      return "Hold release. Shared mocks make the unit suite non-deterministic and can hide logic regressions.";
    }
    if (!branchCoverageGreen) {
      return "Block shipment until critical branches are covered explicitly, not only through happy-path assertions.";
    }
    if (!mutationChecksEnabled && review.risk !== "healthy") {
      return "Keep this module under review. Weak mutation resistance means the suite may miss real defects.";
    }
    if (review.risk === "repair") {
      return "Do not ship. This module is still missing coverage on critical money and locale logic.";
    }
    if (review.risk === "watch") {
      return "Review again after deterministic ordering and stale-data branches are asserted in isolation.";
    }
    return "Unit-test posture is acceptable. The helper boundaries, branch coverage, and mutation resistance are good enough for release.";
  }, [branchCoverageGreen, mocksIsolated, mutationChecksEnabled, review.risk]);

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-6 py-10 text-slate-100">
      <section className="rounded-3xl border border-slate-800 bg-slate-950/80 p-6">
        <p className="text-sm uppercase tracking-[0.25em] text-emerald-300">Frontend Testing Strategies</p>
        <h1 className="mt-2 text-3xl font-semibold">Unit testing release board</h1>
        <p className="mt-3 max-w-3xl text-sm text-slate-300">
          Review isolated logic modules, branch completeness, and determinism before shipping code that depends on helper correctness.
        </p>
        <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <article className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/70 p-5 text-sm text-slate-300">
            <select value={selected} onChange={(event) => setSelected(Number(event.target.value))} className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3">
              {modules.map((item, index) => <option key={item.id} value={index}>{item.label}</option>)}
            </select>
            <div className="grid gap-3 md:grid-cols-2">
              <label className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-950/80 p-3"><input type="checkbox" checked={mocksIsolated} onChange={(event) => setMocksIsolated(event.target.checked)} /> Mocks reset per test</label>
              <label className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-950/80 p-3"><input type="checkbox" checked={branchCoverageGreen} onChange={(event) => setBranchCoverageGreen(event.target.checked)} /> Critical branches covered</label>
              <label className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-950/80 p-3 md:col-span-2"><input type="checkbox" checked={mutationChecksEnabled} onChange={(event) => setMutationChecksEnabled(event.target.checked)} /> Mutation-style checks enabled for risky modules</label>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
              <div className="text-xs uppercase tracking-wide text-slate-500">Release decision</div>
              <p className="mt-2">{decision}</p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
                <div className="text-xs uppercase tracking-wide text-slate-500">Module snapshot</div>
                <ul className="mt-2 space-y-2">
                  <li><span className="font-medium text-slate-100">Owner:</span> {review.owner}</li>
                  <li><span className="font-medium text-slate-100">Release gate:</span> {review.releaseGate}</li>
                  <li><span className="font-medium text-slate-100">Coverage:</span> {review.coverage}</li>
                </ul>
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
                <div className="text-xs uppercase tracking-wide text-slate-500">Assessment</div>
                <p className="mt-2">{review.finding}</p>
              </div>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
              <div className="text-xs uppercase tracking-wide text-slate-500">Scenario matrix</div>
              <ul className="mt-2 space-y-2">{review.scenarios.map((item) => <li key={item}>• {item}</li>)}</ul>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
              <div className="text-xs uppercase tracking-wide text-slate-500">Actions</div>
              <ul className="mt-2 space-y-2">{review.actions.map((item) => <li key={item}>• {item}</li>)}</ul>
            </div>
          </article>
          <aside className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/70 p-5 text-sm text-slate-300">
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
              <div className="text-xs uppercase tracking-wide text-slate-500">Heuristics</div>
              <ul className="mt-2 space-y-2">{heuristics.map((item) => <li key={item}>• {item}</li>)}</ul>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
