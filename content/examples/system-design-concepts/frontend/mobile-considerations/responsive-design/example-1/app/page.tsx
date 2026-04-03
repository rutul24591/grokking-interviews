"use client";

import { useMemo, useState } from "react";
import { responsiveHeuristics, responsiveRisks, viewportStates } from "@/lib/store";

export default function Page() {
  const [selected, setSelected] = useState(0);
  const [denseCards, setDenseCards] = useState(false);
  const [touchTabletMode, setTouchTabletMode] = useState(true);
  const viewport = viewportStates[selected];

  const layoutAdvice = useMemo(() => {
    if (viewport.width < 500) return denseCards
      ? "Dense cards are not appropriate here. Keep a readable phone stack with bottom navigation."
      : "Phone layout should stay single-column and task-prioritized.";
    if (viewport.width < 1024) return touchTabletMode
      ? "Tablet can add a second column, but controls still need touch-safe spacing and stable order."
      : "Non-touch tablet-like layouts can tighten density slightly, but not by breaking order.";
    return "Desktop can add a third column, but the semantic reading order must remain identical to mobile.";
  }, [denseCards, touchTabletMode, viewport]);

  const navigationAdvice = useMemo(() => {
    if (viewport.width < 500) return "Bottom navigation remains the most reachable mobile pattern.";
    return `Current navigation mode: ${viewport.nav}. Verify that it still works on touch devices.`;
  }, [viewport]);

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-6 py-10 text-slate-100">
      <section className="rounded-3xl border border-slate-800 bg-slate-950/80 p-6">
        <p className="text-sm uppercase tracking-[0.25em] text-fuchsia-300">Mobile considerations</p>
        <h1 className="mt-2 text-3xl font-semibold">Responsive design workbench</h1>
        <p className="mt-3 max-w-3xl text-sm text-slate-300">Evaluate how reading order, density, and navigation evolve across phone, tablet, and desktop breakpoints.</p>
        <div className="mt-6 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <article className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/70 p-5 text-sm text-slate-300">
            <select value={selected} onChange={(event) => setSelected(Number(event.target.value))} className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3">
              {viewportStates.map((item, index) => <option key={item.id} value={index}>{item.label}</option>)}
            </select>
            <div className="grid gap-3 md:grid-cols-2">
              <label className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-950/80 p-3"><input type="checkbox" checked={denseCards} onChange={(event) => setDenseCards(event.target.checked)} /> Enable dense cards</label>
              <label className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-950/80 p-3"><input type="checkbox" checked={touchTabletMode} onChange={(event) => setTouchTabletMode(event.target.checked)} /> Treat tablet as touch-first</label>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
                <div className="text-xs uppercase tracking-wide text-slate-500">Viewport snapshot</div>
                <p className="mt-2">Width: {viewport.width}px</p>
                <p className="mt-2">Columns: {viewport.columns}</p>
                <p className="mt-2">Density: {viewport.cardDensity}</p>
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
                <div className="text-xs uppercase tracking-wide text-slate-500">Safety checks</div>
                <p className="mt-2">Tap targets safe: {viewport.tapTargetSafe ? "yes" : "no"}</p>
                <p className="mt-2">Reading order stable: {viewport.readingOrderStable ? "yes" : "no"}</p>
                <p className="mt-2">Navigation: {viewport.nav}</p>
              </div>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4"><div className="text-xs uppercase tracking-wide text-slate-500">Layout advice</div><p className="mt-2">{layoutAdvice}</p></div>
          </article>
          <aside className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/70 p-5 text-sm text-slate-300">
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4"><div className="text-xs uppercase tracking-wide text-slate-500">Navigation review</div><p className="mt-2">{navigationAdvice}</p></div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4"><div className="text-xs uppercase tracking-wide text-slate-500">Heuristics</div><ul className="mt-2 space-y-2">{responsiveHeuristics.map((item) => <li key={item}>• {item}</li>)}</ul></div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4"><div className="text-xs uppercase tracking-wide text-slate-500">Risks</div><ul className="mt-2 space-y-2">{responsiveRisks.map((item) => <li key={item.issue}><span className="font-medium text-slate-100">{item.issue}:</span> {item.action}</li>)}</ul></div>
          </aside>
        </div>
      </section>
    </main>
  );
}
