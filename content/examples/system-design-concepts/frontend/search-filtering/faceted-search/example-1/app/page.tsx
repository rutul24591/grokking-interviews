"use client";

import { useMemo, useState } from "react";
import { facetPolicies, facetRecovery, facetScenarios } from "@/lib/store";

export default function Page() {
  const [selected, setSelected] = useState(0);
  const [showCountPreview, setShowCountPreview] = useState(true);
  const [resetSuggested, setResetSuggested] = useState(false);
  const scenario = facetScenarios[selected];

  const facetPlan = useMemo(() => {
    if (scenario.resultCount === 0) return "Zero results should keep the active facet pills visible and recommend the least destructive filter removal.";
    if (scenario.contradictoryFacets) return "Current facet set is contradictory. Explain the conflict explicitly and offer the shortest path back to a valid result space.";
    return showCountPreview
      ? "Render live facet counts alongside active pills so users can predict the next narrowing step."
      : "Keep the result grid stable, but acknowledge that facet preview counts are hidden for now.";
  }, [scenario, showCountPreview]);

  const countAssessment = useMemo(() => {
    if (scenario.countMode === "stale-counts") return "Facet counts are stale and cannot be trusted for the next interaction.";
    if (scenario.countMode === "partial-recompute") return "Counts are partially recomputed. Mark the side rail as approximate until the next refresh completes.";
    return resetSuggested ? "Reset suggestion is ready. Preserve current pills while promoting the least harmful reset path." : `${scenario.resultCount} results remain under live facet recomputation.`;
  }, [resetSuggested, scenario]);

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-6 py-10 text-slate-100">
      <section className="rounded-3xl border border-slate-800 bg-slate-950/80 p-6">
        <p className="text-sm uppercase tracking-[0.25em] text-emerald-300">Search filtering</p>
        <h1 className="mt-2 text-3xl font-semibold">Faceted search workbench</h1>
        <p className="mt-3 max-w-3xl text-sm text-slate-300">Review active filter pills, count recomputation, and safe recovery when a facet combination collapses the result set.</p>
        <div className="mt-6 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <article className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/70 p-5 text-sm text-slate-300">
            <select value={selected} onChange={(event) => setSelected(Number(event.target.value))} className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3">
              {facetScenarios.map((item, index) => <option key={item.id} value={index}>{item.label}</option>)}
            </select>
            <div className="grid gap-3 md:grid-cols-2">
              <label className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-950/80 p-3"><input type="checkbox" checked={showCountPreview} onChange={(event) => setShowCountPreview(event.target.checked)} /> Show facet count previews</label>
              <label className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-950/80 p-3"><input type="checkbox" checked={resetSuggested} onChange={(event) => setResetSuggested(event.target.checked)} /> Suggest reset path</label>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
              <div className="text-xs uppercase tracking-wide text-slate-500">Facet plan</div>
              <p className="mt-2">{facetPlan}</p>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
              <div className="text-xs uppercase tracking-wide text-slate-500">Active facets</div>
              <ul className="mt-2 space-y-2">{scenario.activeFacets.map((item) => <li key={item}>• {item}</li>)}</ul>
            </div>
          </article>
          <aside className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/70 p-5 text-sm text-slate-300">
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4"><div className="text-xs uppercase tracking-wide text-slate-500">Count assessment</div><p className="mt-2">{countAssessment}</p></div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4"><div className="text-xs uppercase tracking-wide text-slate-500">Policies</div><ul className="mt-2 space-y-2">{facetPolicies.map((item) => <li key={item}>• {item}</li>)}</ul></div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4"><div className="text-xs uppercase tracking-wide text-slate-500">Recovery</div><ul className="mt-2 space-y-2">{facetRecovery.map((item) => <li key={item.issue}><span className="font-medium text-slate-100">{item.issue}:</span> {item.action}</li>)}</ul></div>
          </aside>
        </div>
      </section>
    </main>
  );
}
