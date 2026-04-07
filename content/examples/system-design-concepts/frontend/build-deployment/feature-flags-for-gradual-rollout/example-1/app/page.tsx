"use client";

import { useMemo, useState } from "react";
import { flags, hygiene } from "@/lib/store";

export default function Page() {
  const [selected, setSelected] = useState(0);
  const [targetingValidated, setTargetingValidated] = useState(true);
  const [killSwitchReady, setKillSwitchReady] = useState(true);
  const [allowExpansion, setAllowExpansion] = useState(false);
  const feature = flags[selected];

  const releaseDecision = useMemo(() => {
    if (!targetingValidated) return "Stop rollout. Audience leakage invalidates the whole gradual rollout premise.";
    if (!killSwitchReady) return "Do not expand. An incomplete kill switch makes the flag operationally unsafe.";
    if (feature.state === "repair") return "Disable the flag and clean up dependent side effects before any new exposure.";
    if (feature.state === "watch" || !allowExpansion) return "Keep the current audience slice and repair targeting before promotion.";
    return "Expand exposure one cohort at a time while keeping the kill switch and analytics visible.";
  }, [allowExpansion, feature.state, killSwitchReady, targetingValidated]);

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-6 py-10 text-slate-100">
      <section className="rounded-3xl border border-slate-800 bg-slate-950/80 p-6">
        <p className="text-sm uppercase tracking-[0.25em] text-emerald-300">Frontend Build &amp; Deployment</p>
        <h1 className="mt-2 text-3xl font-semibold">Feature-flag rollout review</h1>
        <p className="mt-3 max-w-3xl text-sm text-slate-300">
          Review audience targeting, kill-switch completeness, and rollout hygiene before increasing exposure.
        </p>
        <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <article className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/70 p-5 text-sm text-slate-300">
            <select
              value={selected}
              onChange={(event) => setSelected(Number(event.target.value))}
              className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3"
            >
              {flags.map((item, index) => (
                <option key={item.id} value={index}>
                  {item.label}
                </option>
              ))}
            </select>
            <div className="grid gap-3 md:grid-cols-2">
              <label className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-950/80 p-3">
                <input type="checkbox" checked={targetingValidated} onChange={(event) => setTargetingValidated(event.target.checked)} />
                Audience targeting validated
              </label>
              <label className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-950/80 p-3">
                <input type="checkbox" checked={killSwitchReady} onChange={(event) => setKillSwitchReady(event.target.checked)} />
                Kill switch covers side effects
              </label>
              <label className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-950/80 p-3 md:col-span-2">
                <input type="checkbox" checked={allowExpansion} onChange={(event) => setAllowExpansion(event.target.checked)} />
                Expand rollout now
              </label>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
              <div className="text-xs uppercase tracking-wide text-slate-500">Rollout decision</div>
              <p className="mt-2">{releaseDecision}</p>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
              <div className="text-xs uppercase tracking-wide text-slate-500">Flag snapshot</div>
              <ul className="mt-2 space-y-2">
                <li><span className="font-medium text-slate-100">Audience:</span> {feature.audience}</li>
                <li><span className="font-medium text-slate-100">Blast radius:</span> {feature.blastRadius}</li>
                <li><span className="font-medium text-slate-100">Finding:</span> {feature.note}</li>
              </ul>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
              <div className="text-xs uppercase tracking-wide text-slate-500">Next-step plan</div>
              <ul className="mt-2 space-y-2">
                {feature.nextStep.map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
            </div>
          </article>
          <aside className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/70 p-5 text-sm text-slate-300">
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
              <div className="text-xs uppercase tracking-wide text-slate-500">Rollout hygiene</div>
              <ul className="mt-2 space-y-2">
                {hygiene.map((item) => (
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
