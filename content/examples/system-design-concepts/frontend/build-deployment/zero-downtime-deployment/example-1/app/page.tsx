"use client";

import { useMemo, useState } from "react";
import { releases, zeroDowntimeRules } from "@/lib/store";

export default function Page() {
  const [selected, setSelected] = useState(0);
  const [readinessTruthful, setReadinessTruthful] = useState(true);
  const [drainWindowAdequate, setDrainWindowAdequate] = useState(true);
  const [assetCompatibilityPinned, setAssetCompatibilityPinned] = useState(true);
  const release = releases[selected];

  const decision = useMemo(() => {
    if (!readinessTruthful) return "Do not deploy. Readiness checks are lying about customer readiness.";
    if (!drainWindowAdequate) return "Hold rollout until long-lived sessions can drain safely.";
    if (!assetCompatibilityPinned) return "Block release. Old HTML may point to deleted assets during the swap.";
    if (release.state === "repair") return "Rollback now. The release is up, but it is not safe for customers.";
    if (release.state === "watch") return "Keep the current lane pinned and fix session handoff before further rollout.";
    return "Proceed. Readiness, draining, and asset compatibility are all aligned with zero-downtime goals.";
  }, [assetCompatibilityPinned, drainWindowAdequate, readinessTruthful, release.state]);

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-6 py-10 text-slate-100">
      <section className="rounded-3xl border border-slate-800 bg-slate-950/80 p-6">
        <p className="text-sm uppercase tracking-[0.25em] text-emerald-300">Frontend Build &amp; Deployment</p>
        <h1 className="mt-2 text-3xl font-semibold">Zero-downtime release review</h1>
        <p className="mt-3 max-w-3xl text-sm text-slate-300">
          Review readiness, draining, and asset compatibility before claiming the rollout is truly zero downtime.
        </p>
        <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <article className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/70 p-5 text-sm text-slate-300">
            <select value={selected} onChange={(event) => setSelected(Number(event.target.value))} className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3">
              {releases.map((item, index) => <option key={item.id} value={index}>{item.label}</option>)}
            </select>
            <div className="grid gap-3 md:grid-cols-2">
              <label className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-950/80 p-3">
                <input type="checkbox" checked={readinessTruthful} onChange={(event) => setReadinessTruthful(event.target.checked)} />
                Readiness reflects customer health
              </label>
              <label className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-950/80 p-3">
                <input type="checkbox" checked={drainWindowAdequate} onChange={(event) => setDrainWindowAdequate(event.target.checked)} />
                Drain window is adequate
              </label>
              <label className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-950/80 p-3 md:col-span-2">
                <input type="checkbox" checked={assetCompatibilityPinned} onChange={(event) => setAssetCompatibilityPinned(event.target.checked)} />
                Asset compatibility is pinned
              </label>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
              <div className="text-xs uppercase tracking-wide text-slate-500">Release decision</div>
              <p className="mt-2">{decision}</p>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
              <div className="text-xs uppercase tracking-wide text-slate-500">Snapshot</div>
              <ul className="mt-2 space-y-2">
                <li><span className="font-medium text-slate-100">Readiness:</span> {release.readiness}</li>
                <li><span className="font-medium text-slate-100">Draining:</span> {release.draining}</li>
                <li><span className="font-medium text-slate-100">Note:</span> {release.note}</li>
              </ul>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
              <div className="text-xs uppercase tracking-wide text-slate-500">Actions</div>
              <ul className="mt-2 space-y-2">
                {release.actions.map((item) => <li key={item}>• {item}</li>)}
              </ul>
            </div>
          </article>
          <aside className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/70 p-5 text-sm text-slate-300">
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
              <div className="text-xs uppercase tracking-wide text-slate-500">Zero-downtime rules</div>
              <ul className="mt-2 space-y-2">
                {zeroDowntimeRules.map((item) => <li key={item}>• {item}</li>)}
              </ul>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
