"use client";

import { useMemo, useState } from "react";
import { localSearchPolicies, localSearchRecovery, localSearchScenarios } from "@/lib/store";

export default function Page() {
  const [selected, setSelected] = useState(0);
  const [highlightMatches, setHighlightMatches] = useState(true);
  const [workerEnabled, setWorkerEnabled] = useState(false);
  const scenario = localSearchScenarios[selected];

  const executionPlan = useMemo(() => {
    if (scenario.datasetSize > 25000) {
      return workerEnabled
        ? "Worker-backed search is required. Keep the UI responsive and trim fuzzy ranking depth before rendering results."
        : "Current dataset is too large for main-thread search. Move indexing off-thread or fall back to server search.";
    }
    if (scenario.staleIndex) return "Results are derived from stale local data. Show a reindex banner and lower confidence in the ranking panel.";
    return highlightMatches
      ? "Run local ranking and render highlighted terms immediately with field weights visible in the side panel."
      : "Search remains local, but disable inline highlights to reduce result rendering cost.";
  }, [highlightMatches, scenario, workerEnabled]);

  const latencyAssessment = useMemo(() => {
    if (scenario.latencyMs > 120) return "Search latency is already high enough to threaten typing responsiveness. Local-only execution is no longer acceptable.";
    if (scenario.latencyMs > 40) return "Search is workable but close to the budget edge. Prefer indexed lookups and trim fuzzy expansion.";
    return "Search latency is healthy for interactive local filtering.";
  }, [scenario]);

  const resultsView = useMemo(() => [
    { label: "Dataset size", value: `${scenario.datasetSize.toLocaleString()} items`, note: scenario.indexMode },
    { label: "Query", value: scenario.query, note: `${scenario.fuzzyTolerance} fuzziness` },
    { label: "Ranking", value: scenario.rankingMode, note: `${scenario.latencyMs}ms search time` }
  ], [scenario]);

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-6 py-10 text-slate-100">
      <section className="rounded-3xl border border-slate-800 bg-slate-950/80 p-6">
        <p className="text-sm uppercase tracking-[0.25em] text-cyan-300">Search filtering</p>
        <h1 className="mt-2 text-3xl font-semibold">Client-side search implementation lab</h1>
        <p className="mt-3 max-w-3xl text-sm text-slate-300">Evaluate local indexing, ranking, render cost, and stale-index recovery before committing to browser-only search.</p>
        <div className="mt-6 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <article className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/70 p-5 text-sm text-slate-300">
            <select value={selected} onChange={(event) => setSelected(Number(event.target.value))} className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3">
              {localSearchScenarios.map((item, index) => <option key={item.id} value={index}>{item.label}</option>)}
            </select>
            <div className="grid gap-3 md:grid-cols-2">
              <label className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-950/80 p-3"><input type="checkbox" checked={highlightMatches} onChange={(event) => setHighlightMatches(event.target.checked)} /> Highlight matched tokens</label>
              <label className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-950/80 p-3"><input type="checkbox" checked={workerEnabled} onChange={(event) => setWorkerEnabled(event.target.checked)} /> Offload search to worker</label>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
              <div className="text-xs uppercase tracking-wide text-slate-500">Execution plan</div>
              <p className="mt-2">{executionPlan}</p>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
              <div className="text-xs uppercase tracking-wide text-slate-500">Scenario metrics</div>
              <ul className="mt-2 space-y-2">{resultsView.map((item) => <li key={item.label}><span className="font-medium text-slate-100">{item.label}:</span> {item.value} · {item.note}</li>)}</ul>
            </div>
          </article>
          <aside className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/70 p-5 text-sm text-slate-300">
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4"><div className="text-xs uppercase tracking-wide text-slate-500">Latency assessment</div><p className="mt-2">{latencyAssessment}</p></div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4"><div className="text-xs uppercase tracking-wide text-slate-500">Policies</div><ul className="mt-2 space-y-2">{localSearchPolicies.map((item) => <li key={item}>• {item}</li>)}</ul></div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4"><div className="text-xs uppercase tracking-wide text-slate-500">Recovery</div><ul className="mt-2 space-y-2">{localSearchRecovery.map((item) => <li key={item.issue}><span className="font-medium text-slate-100">{item.issue}:</span> {item.action}</li>)}</ul></div>
          </aside>
        </div>
      </section>
    </main>
  );
}
