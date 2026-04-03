"use client";

import { useMemo, useState } from "react";
import { elasticPolicies, elasticQueries, elasticRecovery } from "@/lib/store";

export default function Page() {
  const [selected, setSelected] = useState(0);
  const [showExplain, setShowExplain] = useState(true);
  const [retryRequested, setRetryRequested] = useState(false);
  const scenario = elasticQueries[selected];

  const requestPlan = useMemo(() => {
    if (scenario.shardState === "timed-out") return "Search backend timed out. Mark results partial, suppress confidence, and route users toward retry or broader query fallback.";
    if (scenario.relevanceState === "partial") return "Render partial results with lower-confidence messaging and avoid overstating relevance ordering.";
    return showExplain ? "Expose highlight snippets and explain metadata so frontend ranking rationale is visible." : "Use the simpler result surface and omit explain details for speed.";
  }, [scenario, showExplain]);

  const fallbackState = useMemo(() => {
    if (retryRequested && scenario.shardState !== "green") return "Retry is armed. Re-run the search with a simplified query and preserve the current filter context.";
    if (scenario.resultCount === 0 && scenario.shardState === "timed-out") return "Zero results cannot be trusted while the backend is degraded.";
    return `${scenario.resultCount} result(s), highlight mode ${scenario.highlightMode}, timeout ${scenario.timeoutMs}ms.`;
  }, [retryRequested, scenario]);

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-6 py-10 text-slate-100">
      <section className="rounded-3xl border border-slate-800 bg-slate-950/80 p-6">
        <p className="text-sm uppercase tracking-[0.25em] text-sky-300">Search filtering</p>
        <h1 className="mt-2 text-3xl font-semibold">Elasticsearch integration console</h1>
        <p className="mt-3 max-w-3xl text-sm text-slate-300">Review frontend request shaping, highlight handling, and degraded result interpretation for Elasticsearch-backed search.</p>
        <div className="mt-6 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <article className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/70 p-5 text-sm text-slate-300">
            <select value={selected} onChange={(event) => setSelected(Number(event.target.value))} className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3">
              {elasticQueries.map((item, index) => <option key={item.id} value={index}>{item.label}</option>)}
            </select>
            <div className="grid gap-3 md:grid-cols-2">
              <label className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-950/80 p-3"><input type="checkbox" checked={showExplain} onChange={(event) => setShowExplain(event.target.checked)} /> Show explain metadata</label>
              <label className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-950/80 p-3"><input type="checkbox" checked={retryRequested} onChange={(event) => setRetryRequested(event.target.checked)} /> Request retry</label>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
              <div className="text-xs uppercase tracking-wide text-slate-500">Request plan</div>
              <p className="mt-2">{requestPlan}</p>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
              <div className="text-xs uppercase tracking-wide text-slate-500">Search snapshot</div>
              <ul className="mt-2 space-y-2">
                <li><span className="font-medium text-slate-100">Query:</span> {scenario.query}</li>
                <li><span className="font-medium text-slate-100">Highlights:</span> {scenario.highlightMode}</li>
                <li><span className="font-medium text-slate-100">Shard state:</span> {scenario.shardState}</li>
              </ul>
            </div>
          </article>
          <aside className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/70 p-5 text-sm text-slate-300">
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4"><div className="text-xs uppercase tracking-wide text-slate-500">Fallback state</div><p className="mt-2">{fallbackState}</p></div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4"><div className="text-xs uppercase tracking-wide text-slate-500">Policies</div><ul className="mt-2 space-y-2">{elasticPolicies.map((item) => <li key={item}>• {item}</li>)}</ul></div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4"><div className="text-xs uppercase tracking-wide text-slate-500">Recovery</div><ul className="mt-2 space-y-2">{elasticRecovery.map((item) => <li key={item.issue}><span className="font-medium text-slate-100">{item.issue}:</span> {item.action}</li>)}</ul></div>
          </aside>
        </div>
      </section>
    </main>
  );
}
