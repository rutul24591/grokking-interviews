"use client";

import { useMemo, useState } from "react";
import { libraryPolicies, libraryRecovery, libraryScenarios } from "@/lib/store";

export default function Page() {
  const [selected, setSelected] = useState(0);
  const [showHighlights, setShowHighlights] = useState(true);
  const [compareRecall, setCompareRecall] = useState(false);
  const [shipCandidate, setShipCandidate] = useState(false);
  const scenario = libraryScenarios[selected];

  const libraryPlan = useMemo(() => {
    if (scenario.falsePositiveRisk) return "Current fuzzy configuration is too permissive. Run a relevance review before exposing this library profile to every query.";
    if (!scenario.stemming) return "Recall depends heavily on exact tokens. Restore stemming or synonyms before claiming strong natural-language coverage.";
    return compareRecall
      ? "Compare recall against the incumbent library and keep the snippet audit visible during stakeholder review."
      : "Current library profile is stable enough for guided rollout review.";
  }, [compareRecall, scenario]);

  const rolloutDecision = useMemo(() => {
    if (!shipCandidate) return "Shipping is paused. Keep the relevance review open until recall, noise, and highlight quality converge.";
    if (scenario.snippetHealth !== "stable") return "Do not ship yet. Snippet rendering is not stable enough for a broad rollout.";
    return scenario.rolloutAction;
  }, [scenario, shipCandidate]);

  const reviewChecklist = useMemo(
    () => [
      { label: "Indexed docs", value: `${scenario.docsIndexed.toLocaleString()} indexed articles`, note: scenario.library },
      { label: "Recall delta", value: scenario.recallDelta, note: scenario.weighting },
      { label: "Snippet health", value: scenario.snippetHealth, note: showHighlights ? "highlight audit enabled" : "plain snippet fallback" }
    ],
    [scenario, showHighlights]
  );

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-6 py-10 text-slate-100">
      <section className="rounded-3xl border border-slate-800 bg-slate-950/80 p-6">
        <p className="text-sm uppercase tracking-[0.25em] text-violet-300">Search filtering</p>
        <h1 className="mt-2 text-3xl font-semibold">Full-text library rollout review</h1>
        <p className="mt-3 max-w-3xl text-sm text-slate-300">Compare library behavior, audit snippet quality, and decide whether a lightweight frontend search stack is safe to ship.</p>
        <div className="mt-6 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <article className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/70 p-5 text-sm text-slate-300">
            <select value={selected} onChange={(event) => setSelected(Number(event.target.value))} className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3">
              {libraryScenarios.map((item, index) => <option key={item.id} value={index}>{item.label}</option>)}
            </select>
            <div className="grid gap-3 md:grid-cols-3">
              <label className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-950/80 p-3"><input type="checkbox" checked={showHighlights} onChange={(event) => setShowHighlights(event.target.checked)} /> Show token highlights</label>
              <label className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-950/80 p-3"><input type="checkbox" checked={compareRecall} onChange={(event) => setCompareRecall(event.target.checked)} /> Compare recall</label>
              <label className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-950/80 p-3"><input type="checkbox" checked={shipCandidate} onChange={(event) => setShipCandidate(event.target.checked)} /> Mark as ship candidate</label>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4"><div className="text-xs uppercase tracking-wide text-slate-500">Library plan</div><p className="mt-2">{libraryPlan}</p></div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
              <div className="text-xs uppercase tracking-wide text-slate-500">Review checklist</div>
              <ul className="mt-2 space-y-2">{reviewChecklist.map((item) => <li key={item.label}><span className="font-medium text-slate-100">{item.label}:</span> {item.value} · {item.note}</li>)}</ul>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
              <div className="text-xs uppercase tracking-wide text-slate-500">Review owners</div>
              <ul className="mt-2 space-y-2">{scenario.reviewOwners.map((item) => <li key={item}>• {item}</li>)}</ul>
            </div>
          </article>
          <aside className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/70 p-5 text-sm text-slate-300">
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4"><div className="text-xs uppercase tracking-wide text-slate-500">Rollout decision</div><p className="mt-2">{rolloutDecision}</p></div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4"><div className="text-xs uppercase tracking-wide text-slate-500">Policies</div><ul className="mt-2 space-y-2">{libraryPolicies.map((item) => <li key={item}>• {item}</li>)}</ul></div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4"><div className="text-xs uppercase tracking-wide text-slate-500">Recovery</div><ul className="mt-2 space-y-2">{libraryRecovery.map((item) => <li key={item.issue}><span className="font-medium text-slate-100">{item.issue}:</span> {item.action}</li>)}</ul></div>
          </aside>
        </div>
      </section>
    </main>
  );
}
