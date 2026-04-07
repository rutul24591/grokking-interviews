"use client";

import { useMemo, useState } from "react";
import { buildProfiles, guardrails } from "@/lib/store";

export default function Page() {
  const [selected, setSelected] = useState(0);
  const [pluginInventoryCurrent, setPluginInventoryCurrent] = useState(true);
  const [outputBudgetGreen, setOutputBudgetGreen] = useState(true);
  const [forceUpgrade, setForceUpgrade] = useState(false);
  const profile = buildProfiles[selected];

  const decision = useMemo(() => {
    if (!pluginInventoryCurrent) return "Stop the rollout. Unknown plugin compatibility is a release risk.";
    if (!outputBudgetGreen) return "Hold the toolchain change until bundle and build budgets are back inside limits.";
    if (profile.state === "repair") return "Fix the output contract before publishing another build.";
    if (profile.state === "watch" || forceUpgrade) return "Keep the current toolchain pinned until the legacy compatibility issues are resolved.";
    return "Proceed with the current build profile and keep plugin and output checks in the release path.";
  }, [forceUpgrade, outputBudgetGreen, pluginInventoryCurrent, profile.state]);

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-6 py-10 text-slate-100">
      <section className="rounded-3xl border border-slate-800 bg-slate-950/80 p-6">
        <p className="text-sm uppercase tracking-[0.25em] text-emerald-300">Frontend Build &amp; Deployment</p>
        <h1 className="mt-2 text-3xl font-semibold">Bundler configuration review</h1>
        <p className="mt-3 max-w-3xl text-sm text-slate-300">
          Review bundler choice, plugin health, and output contracts before locking in the release pipeline.
        </p>
        <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <article className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/70 p-5 text-sm text-slate-300">
            <select value={selected} onChange={(event) => setSelected(Number(event.target.value))} className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3">
              {buildProfiles.map((item, index) => <option key={item.id} value={index}>{item.label}</option>)}
            </select>
            <div className="grid gap-3 md:grid-cols-2">
              <label className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-950/80 p-3">
                <input type="checkbox" checked={pluginInventoryCurrent} onChange={(event) => setPluginInventoryCurrent(event.target.checked)} />
                Plugin inventory is current
              </label>
              <label className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-950/80 p-3">
                <input type="checkbox" checked={outputBudgetGreen} onChange={(event) => setOutputBudgetGreen(event.target.checked)} />
                Output budget is green
              </label>
              <label className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-950/80 p-3 md:col-span-2">
                <input type="checkbox" checked={forceUpgrade} onChange={(event) => setForceUpgrade(event.target.checked)} />
                Force the upgrade despite compatibility warnings
              </label>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
              <div className="text-xs uppercase tracking-wide text-slate-500">Decision</div>
              <p className="mt-2">{decision}</p>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
              <div className="text-xs uppercase tracking-wide text-slate-500">Profile</div>
              <ul className="mt-2 space-y-2">
                <li><span className="font-medium text-slate-100">Fit:</span> {profile.fit}</li>
                <li><span className="font-medium text-slate-100">Constraint:</span> {profile.constraints}</li>
              </ul>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
              <div className="text-xs uppercase tracking-wide text-slate-500">Configuration actions</div>
              <ul className="mt-2 space-y-2">
                {profile.decisions.map((item) => <li key={item}>• {item}</li>)}
              </ul>
            </div>
          </article>
          <aside className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/70 p-5 text-sm text-slate-300">
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
              <div className="text-xs uppercase tracking-wide text-slate-500">Guardrails</div>
              <ul className="mt-2 space-y-2">
                {guardrails.map((item) => <li key={item}>• {item}</li>)}
              </ul>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
