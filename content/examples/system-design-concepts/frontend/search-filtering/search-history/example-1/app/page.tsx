"use client";

import { useMemo, useState } from "react";
import { historyPolicies, historyRecovery, historyScenarios } from "@/lib/store";

export default function Page() {
  const [selected, setSelected] = useState(0);
  const [pinLatest, setPinLatest] = useState(false);
  const [clearRequested, setClearRequested] = useState(false);
  const [sensitiveMode, setSensitiveMode] = useState(false);
  const scenario = historyScenarios[selected];

  const storagePlan = useMemo(() => {
    if (scenario.privateMode) return "Persistent history must stay off. Keep recent searches in memory only and clear them when the session ends.";
    if (scenario.dedupeState === "overfull") return "History is over capacity. Trim the oldest non-pinned searches and normalize duplicates before showing suggestions.";
    return pinLatest ? "Pin the latest search without disturbing recency ordering for the remaining history entries." : "History storage is healthy and can be reused for suggestions.";
  }, [pinLatest, scenario]);

  const privacyAssessment = useMemo(() => {
    if (sensitiveMode && scenario.storageMode !== "memory-only-session") return "Sensitive mode requires a tighter storage policy than the current configuration. Move to memory-only history before enabling reuse.";
    if (clearRequested) return "Clear request is pending. Remove stored history immediately and invalidate suggestion boosts tied to recent queries.";
    return scenario.reviewAction;
  }, [clearRequested, scenario, sensitiveMode]);

  const historyMetrics = useMemo(
    () => [
      { label: "Retention", value: `${scenario.retentionDays} days`, note: scenario.storageMode },
      { label: "Pinned queries", value: String(scenario.pinnedQueries), note: scenario.reuseRate },
      { label: "Risk review", value: scenario.dedupeState, note: scenario.privateMode ? "private session" : "persistent session" }
    ],
    [scenario]
  );

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-6 py-10 text-slate-100">
      <section className="rounded-3xl border border-slate-800 bg-slate-950/80 p-6">
        <p className="text-sm uppercase tracking-[0.25em] text-amber-300">Search filtering</p>
        <h1 className="mt-2 text-3xl font-semibold">Search history policy review</h1>
        <p className="mt-3 max-w-3xl text-sm text-slate-300">Review retention, pinning, privacy boundaries, and autocomplete reuse before shipping stored search history.</p>
        <div className="mt-6 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <article className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/70 p-5 text-sm text-slate-300">
            <select value={selected} onChange={(event) => setSelected(Number(event.target.value))} className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3">
              {historyScenarios.map((item, index) => <option key={item.id} value={index}>{item.label}</option>)}
            </select>
            <div className="grid gap-3 md:grid-cols-3">
              <label className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-950/80 p-3"><input type="checkbox" checked={pinLatest} onChange={(event) => setPinLatest(event.target.checked)} /> Pin latest search</label>
              <label className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-950/80 p-3"><input type="checkbox" checked={clearRequested} onChange={(event) => setClearRequested(event.target.checked)} /> Clear history</label>
              <label className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-950/80 p-3"><input type="checkbox" checked={sensitiveMode} onChange={(event) => setSensitiveMode(event.target.checked)} /> Treat session as sensitive</label>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4"><div className="text-xs uppercase tracking-wide text-slate-500">Storage plan</div><p className="mt-2">{storagePlan}</p></div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4"><div className="text-xs uppercase tracking-wide text-slate-500">History metrics</div><ul className="mt-2 space-y-2">{historyMetrics.map((item) => <li key={item.label}><span className="font-medium text-slate-100">{item.label}:</span> {item.value} · {item.note}</li>)}</ul></div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4"><div className="text-xs uppercase tracking-wide text-slate-500">Recent queries</div><ul className="mt-2 space-y-2">{scenario.queries.map((item) => <li key={item}>• {item}</li>)}</ul></div>
          </article>
          <aside className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/70 p-5 text-sm text-slate-300">
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4"><div className="text-xs uppercase tracking-wide text-slate-500">Privacy assessment</div><p className="mt-2">{privacyAssessment}</p></div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4"><div className="text-xs uppercase tracking-wide text-slate-500">Risk notes</div><ul className="mt-2 space-y-2">{scenario.riskNotes.map((item) => <li key={item}>• {item}</li>)}</ul></div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4"><div className="text-xs uppercase tracking-wide text-slate-500">Policies</div><ul className="mt-2 space-y-2">{historyPolicies.map((item) => <li key={item}>• {item}</li>)}</ul></div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4"><div className="text-xs uppercase tracking-wide text-slate-500">Recovery</div><ul className="mt-2 space-y-2">{historyRecovery.map((item) => <li key={item.issue}><span className="font-medium text-slate-100">{item.issue}:</span> {item.action}</li>)}</ul></div>
          </aside>
        </div>
      </section>
    </main>
  );
}
