"use client";

import { useMemo, useState } from "react";
import { canaries, recoveryLanes } from "@/lib/store";

export default function Page() {
  const [selected, setSelected] = useState(0);
  const [segmentSplit, setSegmentSplit] = useState(true);
  const [killSwitchReady, setKillSwitchReady] = useState(true);
  const [autoExpand, setAutoExpand] = useState(false);
  const canary = canaries[selected];

  const releaseDecision = useMemo(() => {
    if (!killSwitchReady) return "Do not release. A canary without a fast kill switch is just partial production risk.";
    if (!segmentSplit) return "Block expansion until cohort metrics are split by segment. Global averages hide the exact failures canaries are meant to expose.";
    if (canary.risk === "repair") return "Rollback the canary to zero percent and freeze expansion.";
    if (canary.risk === "watch" || !autoExpand) return "Keep the current cohort size and wait for clearer evidence before promotion.";
    return "Promote to the next cohort while preserving a clean control group and continuing segment-specific checks.";
  }, [autoExpand, canary.risk, killSwitchReady, segmentSplit]);

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-6 py-10 text-slate-100">
      <section className="rounded-3xl border border-slate-800 bg-slate-950/80 p-6">
        <p className="text-sm uppercase tracking-[0.25em] text-emerald-300">Frontend Build &amp; Deployment</p>
        <h1 className="mt-2 text-3xl font-semibold">Canary release cohort review</h1>
        <p className="mt-3 max-w-3xl text-sm text-slate-300">
          Review cohort health, stop conditions, and automation controls before the next exposure increase.
        </p>
        <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <article className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/70 p-5 text-sm text-slate-300">
            <select
              value={selected}
              onChange={(event) => setSelected(Number(event.target.value))}
              className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3"
            >
              {canaries.map((item, index) => (
                <option key={item.id} value={index}>
                  {item.label}
                </option>
              ))}
            </select>
            <div className="grid gap-3 md:grid-cols-2">
              <label className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-950/80 p-3">
                <input type="checkbox" checked={segmentSplit} onChange={(event) => setSegmentSplit(event.target.checked)} />
                Segment metrics available
              </label>
              <label className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-950/80 p-3">
                <input type="checkbox" checked={killSwitchReady} onChange={(event) => setKillSwitchReady(event.target.checked)} />
                Kill switch is armed
              </label>
              <label className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-950/80 p-3 md:col-span-2">
                <input type="checkbox" checked={autoExpand} onChange={(event) => setAutoExpand(event.target.checked)} />
                Allow the automation to expand the canary
              </label>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
              <div className="text-xs uppercase tracking-wide text-slate-500">Release decision</div>
              <p className="mt-2">{releaseDecision}</p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
                <div className="text-xs uppercase tracking-wide text-slate-500">Cohort</div>
                <p className="mt-2">{canary.cohort}</p>
                <p className="mt-3 text-xs text-slate-400">{canary.expansion}</p>
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
                <div className="text-xs uppercase tracking-wide text-slate-500">Guardrail</div>
                <p className="mt-2">{canary.guardrail}</p>
              </div>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
              <div className="text-xs uppercase tracking-wide text-slate-500">Expansion notes</div>
              <ul className="mt-2 space-y-2">
                {canary.notes.map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
            </div>
          </article>
          <aside className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/70 p-5 text-sm text-slate-300">
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
              <div className="text-xs uppercase tracking-wide text-slate-500">Rollback and recovery</div>
              <ul className="mt-2 space-y-2">
                {recoveryLanes.map((item) => (
                  <li key={item.issue}>
                    <span className="font-medium text-slate-100">{item.issue}:</span> {item.action}
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
