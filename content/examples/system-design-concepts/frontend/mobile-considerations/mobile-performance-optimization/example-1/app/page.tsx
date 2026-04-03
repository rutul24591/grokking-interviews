"use client";

import { useMemo, useState } from "react";
import { budgetAlerts, deviceProfiles, performancePlaybook } from "@/lib/store";

export default function Page() {
  const [selected, setSelected] = useState(0);
  const [heavyCharts, setHeavyCharts] = useState(false);
  const [liveSearch, setLiveSearch] = useState(true);
  const profile = deviceProfiles[selected];

  const interactionPlan = useMemo(() => {
    if (profile.cpuBudget === "critical") return "Disable heavy charts, debounce live search hard, and keep only minimal interactive islands.";
    if (profile.cpuBudget === "tight") return heavyCharts ? "Defer charts behind a tap and keep motion reduced until the user requests detail." : "Use split hydration with reduced-motion defaults.";
    return "Full interaction budget is acceptable, but keep long-task monitors running in production.";
  }, [heavyCharts, profile]);

  const searchPlan = useMemo(() => {
    if (!liveSearch) return "Manual search submission removes validation and typing pressure on constrained devices.";
    if (profile.longTaskMs > 150) return "Live search should batch keystrokes and return compact results to protect typing latency.";
    return "Live search can stay enabled with standard throttling.";
  }, [liveSearch, profile]);

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-6 py-10 text-slate-100">
      <section className="rounded-3xl border border-slate-800 bg-slate-950/80 p-6">
        <p className="text-sm uppercase tracking-[0.25em] text-orange-300">Mobile considerations</p>
        <h1 className="mt-2 text-3xl font-semibold">Mobile performance console</h1>
        <p className="mt-3 max-w-3xl text-sm text-slate-300">Review CPU, memory, hydration, and motion budgets for mobile devices with materially different performance envelopes.</p>
        <div className="mt-6 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <article className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/70 p-5 text-sm text-slate-300">
            <select value={selected} onChange={(event) => setSelected(Number(event.target.value))} className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3">
              {deviceProfiles.map((item, index) => <option key={item.id} value={index}>{item.label}</option>)}
            </select>
            <div className="grid gap-3 md:grid-cols-2">
              <label className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-950/80 p-3"><input type="checkbox" checked={heavyCharts} onChange={(event) => setHeavyCharts(event.target.checked)} /> Enable heavy chart module</label>
              <label className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-950/80 p-3"><input type="checkbox" checked={liveSearch} onChange={(event) => setLiveSearch(event.target.checked)} /> Enable live search</label>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
                <div className="text-xs uppercase tracking-wide text-slate-500">Device profile</div>
                <p className="mt-2">CPU: {profile.cpuBudget}</p>
                <p className="mt-2">Memory: {profile.memoryMb}MB</p>
                <p className="mt-2">Hydration: {profile.hydrationMode}</p>
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
                <div className="text-xs uppercase tracking-wide text-slate-500">Runtime pressure</div>
                <p className="mt-2">Animation budget: {profile.animationBudget}</p>
                <p className="mt-2">Observed long task: {profile.longTaskMs}ms</p>
              </div>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4"><div className="text-xs uppercase tracking-wide text-slate-500">Interaction plan</div><p className="mt-2">{interactionPlan}</p></div>
          </article>
          <aside className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/70 p-5 text-sm text-slate-300">
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4"><div className="text-xs uppercase tracking-wide text-slate-500">Search strategy</div><p className="mt-2">{searchPlan}</p></div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4"><div className="text-xs uppercase tracking-wide text-slate-500">Playbook</div><ul className="mt-2 space-y-2">{performancePlaybook.map((item) => <li key={item}>• {item}</li>)}</ul></div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4"><div className="text-xs uppercase tracking-wide text-slate-500">Budget alerts</div><ul className="mt-2 space-y-2">{budgetAlerts.map((item) => <li key={item.issue}><span className="font-medium text-slate-100">{item.issue}:</span> {item.action}</li>)}</ul></div>
          </aside>
        </div>
      </section>
    </main>
  );
}
