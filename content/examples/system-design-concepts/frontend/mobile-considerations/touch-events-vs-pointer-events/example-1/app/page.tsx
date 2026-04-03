"use client";

import { useMemo, useState } from "react";
import { inputPolicies, inputRecovery, inputScenarios } from "@/lib/store";

export default function Page() {
  const [selected, setSelected] = useState(0);
  const [gestureEnabled, setGestureEnabled] = useState(true);
  const [scrollContainer, setScrollContainer] = useState(true);
  const scenario = inputScenarios[selected];

  const eventPlan = useMemo(() => {
    if (scenario.inputModel === "pointer") return "Use pointer events for tap, drag, and hover parity, with touch-action tuned per gesture region.";
    if (!scenario.passiveHandlers && scrollContainer) return "Legacy touch handlers are blocking scroll. Mark handlers passive and isolate the gesture zone.";
    return gestureEnabled ? `Support ${scenario.customGesture} with a touch fallback, but keep explicit tap states for non-hover users.` : "Use simple tap interactions only and avoid custom gestures.";
  }, [gestureEnabled, scenario, scrollContainer]);

  const accessibilityPlan = useMemo(() => {
    if (!scenario.hoverSupport) return "No hover support. All previews and state transitions must be reachable through tap and focus.";
    return "Hover affordances can enhance discovery, but the tap path still must remain primary.";
  }, [scenario]);

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-6 py-10 text-slate-100">
      <section className="rounded-3xl border border-slate-800 bg-slate-950/80 p-6">
        <p className="text-sm uppercase tracking-[0.25em] text-lime-300">Mobile considerations</p>
        <h1 className="mt-2 text-3xl font-semibold">Touch vs pointer events lab</h1>
        <p className="mt-3 max-w-3xl text-sm text-slate-300">Compare unified pointer handling with touch-specific implementations and review the regressions that usually appear on mobile surfaces.</p>
        <div className="mt-6 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <article className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/70 p-5 text-sm text-slate-300">
            <select value={selected} onChange={(event) => setSelected(Number(event.target.value))} className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3">
              {inputScenarios.map((item, index) => <option key={item.id} value={index}>{item.label}</option>)}
            </select>
            <div className="grid gap-3 md:grid-cols-2">
              <label className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-950/80 p-3"><input type="checkbox" checked={gestureEnabled} onChange={(event) => setGestureEnabled(event.target.checked)} /> Enable custom gesture</label>
              <label className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-950/80 p-3"><input type="checkbox" checked={scrollContainer} onChange={(event) => setScrollContainer(event.target.checked)} /> Gesture in scroll container</label>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
                <div className="text-xs uppercase tracking-wide text-slate-500">Scenario</div>
                <p className="mt-2">Input model: {scenario.inputModel}</p>
                <p className="mt-2">Hover support: {scenario.hoverSupport ? "yes" : "no"}</p>
                <p className="mt-2">Gesture: {scenario.customGesture}</p>
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
                <div className="text-xs uppercase tracking-wide text-slate-500">Legacy risk</div>
                <p className="mt-2">Passive handlers: {scenario.passiveHandlers ? "yes" : "no"}</p>
                <p className="mt-2">Duplicate click risk: {scenario.duplicateClickRisk ? "present" : "low"}</p>
              </div>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4"><div className="text-xs uppercase tracking-wide text-slate-500">Event plan</div><p className="mt-2">{eventPlan}</p></div>
          </article>
          <aside className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/70 p-5 text-sm text-slate-300">
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4"><div className="text-xs uppercase tracking-wide text-slate-500">Accessibility plan</div><p className="mt-2">{accessibilityPlan}</p></div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4"><div className="text-xs uppercase tracking-wide text-slate-500">Policies</div><ul className="mt-2 space-y-2">{inputPolicies.map((item) => <li key={item}>• {item}</li>)}</ul></div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4"><div className="text-xs uppercase tracking-wide text-slate-500">Recovery playbook</div><ul className="mt-2 space-y-2">{inputRecovery.map((item) => <li key={item.issue}><span className="font-medium text-slate-100">{item.issue}:</span> {item.action}</li>)}</ul></div>
          </aside>
        </div>
      </section>
    </main>
  );
}
