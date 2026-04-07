"use client";

import { useMemo, useState } from "react";
import { pipelineRuns, policy } from "@/lib/store";

export default function Page() {
  const [selected, setSelected] = useState(0);
  const [immutableArtifact, setImmutableArtifact] = useState(true);
  const [manualApproval, setManualApproval] = useState(true);
  const [allowRetry, setAllowRetry] = useState(false);
  const run = pipelineRuns[selected];

  const releaseDecision = useMemo(() => {
    if (!immutableArtifact) return "Block promotion. Rebuilding between stages breaks the CI/CD evidence chain.";
    if (!manualApproval) return "Hold production release until the final operator approval is restored.";
    if (run.state === "repair") return "Rollback the live artifact and freeze the pipeline.";
    if (run.state === "watch" || allowRetry) return "Pause and stabilize the failing gate before any promotion.";
    return "Promote the signed artifact through the remaining stages with the existing evidence set.";
  }, [allowRetry, immutableArtifact, manualApproval, run.state]);

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-6 py-10 text-slate-100">
      <section className="rounded-3xl border border-slate-800 bg-slate-950/80 p-6">
        <p className="text-sm uppercase tracking-[0.25em] text-emerald-300">Frontend Build &amp; Deployment</p>
        <h1 className="mt-2 text-3xl font-semibold">CI/CD release gate review</h1>
        <p className="mt-3 max-w-3xl text-sm text-slate-300">
          Inspect artifact integrity, stage health, and promotion evidence before shipping to production.
        </p>
        <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <article className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/70 p-5 text-sm text-slate-300">
            <select
              value={selected}
              onChange={(event) => setSelected(Number(event.target.value))}
              className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3"
            >
              {pipelineRuns.map((item, index) => (
                <option key={item.id} value={index}>
                  {item.label}
                </option>
              ))}
            </select>
            <div className="grid gap-3 md:grid-cols-2">
              <label className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-950/80 p-3">
                <input type="checkbox" checked={immutableArtifact} onChange={(event) => setImmutableArtifact(event.target.checked)} />
                Promote one immutable artifact
              </label>
              <label className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-950/80 p-3">
                <input type="checkbox" checked={manualApproval} onChange={(event) => setManualApproval(event.target.checked)} />
                Final approval is present
              </label>
              <label className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-950/80 p-3 md:col-span-2">
                <input type="checkbox" checked={allowRetry} onChange={(event) => setAllowRetry(event.target.checked)} />
                Retry a failing gate without root-cause analysis
              </label>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
              <div className="text-xs uppercase tracking-wide text-slate-500">Pipeline decision</div>
              <p className="mt-2">{releaseDecision}</p>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
              <div className="text-xs uppercase tracking-wide text-slate-500">Run snapshot</div>
              <ul className="mt-2 space-y-2">
                <li><span className="font-medium text-slate-100">Branch:</span> {run.branch}</li>
                <li><span className="font-medium text-slate-100">Artifact:</span> {run.artifact}</li>
                <li><span className="font-medium text-slate-100">Failing stage:</span> {run.failingStage}</li>
                <li><span className="font-medium text-slate-100">Summary:</span> {run.summary}</li>
              </ul>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
              <div className="text-xs uppercase tracking-wide text-slate-500">Stage expectations</div>
              <ul className="mt-2 space-y-2">
                {run.stages.map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
            </div>
          </article>
          <aside className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/70 p-5 text-sm text-slate-300">
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
              <div className="text-xs uppercase tracking-wide text-slate-500">Pipeline policy</div>
              <ul className="mt-2 space-y-2">
                {policy.map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
