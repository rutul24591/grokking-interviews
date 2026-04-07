"use client";

import { useMemo, useState } from "react";
import { rollbackCases, rollbackPolicy } from "@/lib/store";

export default function Page() {
  const [selected, setSelected] = useState(0);
  const [previousArtifactReady, setPreviousArtifactReady] = useState(true);
  const [sessionCompatibility, setSessionCompatibility] = useState(true);
  const [cachePurgeSequenced, setCachePurgeSequenced] = useState(false);
  const rollbackCase = rollbackCases[selected];

  const decision = useMemo(() => {
    if (!previousArtifactReady) return "Block release recovery. There is no trustworthy rollback artifact available.";
    if (!sessionCompatibility) return "Do not rollback blindly. Fix session compatibility or users will swap one outage for another.";
    if (rollbackCase.state === "repair") return "Rollback traffic immediately and preserve session continuity while caches are updated.";
    if (rollbackCase.state === "watch" || !cachePurgeSequenced) return "Hold on the current lane until cache invalidation and API compatibility are both understood.";
    return "Use the prepared rollback lane and reverse bundle, config, and cache state together.";
  }, [cachePurgeSequenced, previousArtifactReady, rollbackCase.state, sessionCompatibility]);

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-6 py-10 text-slate-100">
      <section className="rounded-3xl border border-slate-800 bg-slate-950/80 p-6">
        <p className="text-sm uppercase tracking-[0.25em] text-emerald-300">Frontend Build &amp; Deployment</p>
        <h1 className="mt-2 text-3xl font-semibold">Rollback strategy review</h1>
        <p className="mt-3 max-w-3xl text-sm text-slate-300">
          Review the rollback lane before an incident forces operators to restore the last stable experience.
        </p>
        <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <article className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/70 p-5 text-sm text-slate-300">
            <select
              value={selected}
              onChange={(event) => setSelected(Number(event.target.value))}
              className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3"
            >
              {rollbackCases.map((item, index) => (
                <option key={item.id} value={index}>{item.label}</option>
              ))}
            </select>
            <div className="grid gap-3 md:grid-cols-2">
              <label className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-950/80 p-3">
                <input type="checkbox" checked={previousArtifactReady} onChange={(event) => setPreviousArtifactReady(event.target.checked)} />
                Previous artifact is ready
              </label>
              <label className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-950/80 p-3">
                <input type="checkbox" checked={sessionCompatibility} onChange={(event) => setSessionCompatibility(event.target.checked)} />
                Session compatibility verified
              </label>
              <label className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-950/80 p-3 md:col-span-2">
                <input type="checkbox" checked={cachePurgeSequenced} onChange={(event) => setCachePurgeSequenced(event.target.checked)} />
                Cache purge order is planned
              </label>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
              <div className="text-xs uppercase tracking-wide text-slate-500">Rollback decision</div>
              <p className="mt-2">{decision}</p>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
              <div className="text-xs uppercase tracking-wide text-slate-500">Incident snapshot</div>
              <ul className="mt-2 space-y-2">
                <li><span className="font-medium text-slate-100">Blast radius:</span> {rollbackCase.blastRadius}</li>
                <li><span className="font-medium text-slate-100">Preferred lane:</span> {rollbackCase.preferredLane}</li>
              </ul>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
              <div className="text-xs uppercase tracking-wide text-slate-500">Operator notes</div>
              <ul className="mt-2 space-y-2">
                {rollbackCase.notes.map((item) => <li key={item}>• {item}</li>)}
              </ul>
            </div>
          </article>
          <aside className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/70 p-5 text-sm text-slate-300">
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
              <div className="text-xs uppercase tracking-wide text-slate-500">Rollback policy</div>
              <ul className="mt-2 space-y-2">
                {rollbackPolicy.map((item) => <li key={item}>• {item}</li>)}
              </ul>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
