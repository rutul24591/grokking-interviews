"use client";

import { useMemo, useState } from "react";
import { envReleases, safeguards } from "@/lib/store";

export default function Page() {
  const [selected, setSelected] = useState(0);
  const [bundleScanClean, setBundleScanClean] = useState(true);
  const [runtimeValidated, setRuntimeValidated] = useState(true);
  const [forcePromotion, setForcePromotion] = useState(false);
  const release = envReleases[selected];

  const releaseDecision = useMemo(() => {
    if (!bundleScanClean) return "Block release and rotate any secret that leaked into preview artifacts.";
    if (!runtimeValidated) return "Do not ship. Required runtime configuration must be validated before traffic reaches the app.";
    if (release.state === "repair") return "Keep traffic on the previous release contract until the missing runtime keys are restored.";
    if (release.state === "watch" || forcePromotion) return "Stop promotion and fix the config boundary issue instead of shipping around it.";
    return "Approve release. The client/public contract and server/runtime contract are both clean.";
  }, [bundleScanClean, forcePromotion, release.state, runtimeValidated]);

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-6 py-10 text-slate-100">
      <section className="rounded-3xl border border-slate-800 bg-slate-950/80 p-6">
        <p className="text-sm uppercase tracking-[0.25em] text-emerald-300">Frontend Build &amp; Deployment</p>
        <h1 className="mt-2 text-3xl font-semibold">Environment variable contract review</h1>
        <p className="mt-3 max-w-3xl text-sm text-slate-300">
          Review public and private configuration boundaries before a build is allowed into production.
        </p>
        <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <article className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/70 p-5 text-sm text-slate-300">
            <select
              value={selected}
              onChange={(event) => setSelected(Number(event.target.value))}
              className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3"
            >
              {envReleases.map((item, index) => (
                <option key={item.id} value={index}>
                  {item.label}
                </option>
              ))}
            </select>
            <div className="grid gap-3 md:grid-cols-2">
              <label className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-950/80 p-3">
                <input type="checkbox" checked={bundleScanClean} onChange={(event) => setBundleScanClean(event.target.checked)} />
                Bundle scan is clean
              </label>
              <label className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-950/80 p-3">
                <input type="checkbox" checked={runtimeValidated} onChange={(event) => setRuntimeValidated(event.target.checked)} />
                Runtime contract validated
              </label>
              <label className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-950/80 p-3 md:col-span-2">
                <input type="checkbox" checked={forcePromotion} onChange={(event) => setForcePromotion(event.target.checked)} />
                Force the promotion despite the finding
              </label>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
              <div className="text-xs uppercase tracking-wide text-slate-500">Release decision</div>
              <p className="mt-2">{releaseDecision}</p>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
              <div className="text-xs uppercase tracking-wide text-slate-500">Contract snapshot</div>
              <ul className="mt-2 space-y-2">
                <li><span className="font-medium text-slate-100">Runtime:</span> {release.runtime}</li>
                <li><span className="font-medium text-slate-100">Public:</span> {release.publicVars}</li>
                <li><span className="font-medium text-slate-100">Finding:</span> {release.finding}</li>
              </ul>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
              <div className="text-xs uppercase tracking-wide text-slate-500">Release plan</div>
              <ul className="mt-2 space-y-2">
                {release.plan.map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
            </div>
          </article>
          <aside className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/70 p-5 text-sm text-slate-300">
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
              <div className="text-xs uppercase tracking-wide text-slate-500">Safeguards</div>
              <ul className="mt-2 space-y-2">
                {safeguards.map((item) => (
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
