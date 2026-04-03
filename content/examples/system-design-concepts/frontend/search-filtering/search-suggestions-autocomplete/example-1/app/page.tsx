"use client";

import { useMemo, useState } from "react";
import { autocompletePolicies, autocompleteRecovery, autocompleteScenarios } from "@/lib/store";

export default function Page() {
  const [selected, setSelected] = useState(0);
  const [keyboardMode, setKeyboardMode] = useState(true);
  const [historyBoost, setHistoryBoost] = useState(true);
  const scenario = autocompleteScenarios[selected];

  const suggestionPlan = useMemo(() => {
    if (scenario.staleSuggestionRisk) return "Current suggestion service is at risk of rendering stale entries. Gate rendering by active query token and preserve focus state independently.";
    if (!keyboardMode) return "Pointer-only interaction is enabled. Keep keyboard affordances documented because autocomplete still needs an accessible escape path.";
    return historyBoost ? "Blend prefix results with recent-history boosts, but keep the active option stable during updates." : "Use pure prefix ranking and avoid history bias for this query.";
  }, [historyBoost, keyboardMode, scenario]);

  const keyboardAssessment = useMemo(() => {
    if (scenario.keyboardState === "repair") return "Keyboard focus is unstable. Do not trust arrow-key navigation until active-option state is repaired.";
    return `${scenario.suggestionCount} suggestions with ${scenario.rankingMode} ranking.`;
  }, [scenario]);

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-6 py-10 text-slate-100">
      <section className="rounded-3xl border border-slate-800 bg-slate-950/80 p-6">
        <p className="text-sm uppercase tracking-[0.25em] text-lime-300">Search filtering</p>
        <h1 className="mt-2 text-3xl font-semibold">Search suggestions and autocomplete lab</h1>
        <p className="mt-3 max-w-3xl text-sm text-slate-300">Review suggestion ranking, active-option stability, history boosts, and stale-response protection in autocomplete flows.</p>
        <div className="mt-6 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <article className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/70 p-5 text-sm text-slate-300">
            <select value={selected} onChange={(event) => setSelected(Number(event.target.value))} className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3">
              {autocompleteScenarios.map((item, index) => <option key={item.id} value={index}>{item.label}</option>)}
            </select>
            <div className="grid gap-3 md:grid-cols-2">
              <label className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-950/80 p-3"><input type="checkbox" checked={keyboardMode} onChange={(event) => setKeyboardMode(event.target.checked)} /> Keyboard navigation enabled</label>
              <label className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-950/80 p-3"><input type="checkbox" checked={historyBoost} onChange={(event) => setHistoryBoost(event.target.checked)} /> Enable history boost</label>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4"><div className="text-xs uppercase tracking-wide text-slate-500">Suggestion plan</div><p className="mt-2">{suggestionPlan}</p></div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
              <div className="text-xs uppercase tracking-wide text-slate-500">Suggestion snapshot</div>
              <ul className="mt-2 space-y-2">
                <li><span className="font-medium text-slate-100">Query:</span> {scenario.query}</li>
                <li><span className="font-medium text-slate-100">Suggestions:</span> {scenario.suggestionCount}</li>
                <li><span className="font-medium text-slate-100">Ranking:</span> {scenario.rankingMode}</li>
              </ul>
            </div>
          </article>
          <aside className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/70 p-5 text-sm text-slate-300">
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4"><div className="text-xs uppercase tracking-wide text-slate-500">Keyboard assessment</div><p className="mt-2">{keyboardAssessment}</p></div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4"><div className="text-xs uppercase tracking-wide text-slate-500">Policies</div><ul className="mt-2 space-y-2">{autocompletePolicies.map((item) => <li key={item}>• {item}</li>)}</ul></div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4"><div className="text-xs uppercase tracking-wide text-slate-500">Recovery</div><ul className="mt-2 space-y-2">{autocompleteRecovery.map((item) => <li key={item.issue}><span className="font-medium text-slate-100">{item.issue}:</span> {item.action}</li>)}</ul></div>
          </aside>
        </div>
      </section>
    </main>
  );
}
