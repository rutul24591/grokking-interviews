"use client";

import { useMemo, useState } from "react";
import { layoutWarnings, mobileFirstPractices, mobileSurfaces } from "@/lib/store";

export default function Page() {
  const [selected, setSelected] = useState(0);
  const [secondaryRail, setSecondaryRail] = useState(false);
  const [denseMode, setDenseMode] = useState(false);
  const surface = mobileSurfaces[selected];

  const composition = useMemo(() => {
    if (surface.width < 480) return denseMode
      ? "Dense mode is too aggressive for phones. Keep one-column reading and bottom actions."
      : "Use a one-column layout with the resume CTA anchored near the bottom edge.";
    if (surface.width < 1024) return secondaryRail
      ? "Tablet can show a contextual side sheet, but it must collapse without changing content order."
      : "Keep the library two-column layout with search and collections above fold.";
    return "Desktop can surface the secondary rail persistently while preserving the same primary article flow.";
  }, [denseMode, secondaryRail, surface]);

  const thumbReach = useMemo(() => {
    if (surface.thumbReachScore === "high") return "Primary action is already reachable for one-handed use.";
    if (surface.thumbReachScore === "medium") return "Check that toolbar and rail toggles stay within reach in portrait tablets.";
    return "Desktop layout is fine, but do not port this action placement back to phones.";
  }, [surface]);

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-6 py-10 text-slate-100">
      <section className="rounded-3xl border border-slate-800 bg-slate-950/80 p-6">
        <p className="text-sm uppercase tracking-[0.25em] text-violet-300">Mobile considerations</p>
        <h1 className="mt-2 text-3xl font-semibold">Mobile-first design studio</h1>
        <p className="mt-3 max-w-3xl text-sm text-slate-300">Evaluate how a product surface evolves from phone-first composition into tablet and desktop layouts without losing task priority.</p>
        <div className="mt-6 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <article className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/70 p-5 text-sm text-slate-300">
            <select value={selected} onChange={(event) => setSelected(Number(event.target.value))} className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3">
              {mobileSurfaces.map((item, index) => <option key={item.id} value={index}>{item.label}</option>)}
            </select>
            <div className="grid gap-3 md:grid-cols-2">
              <label className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-950/80 p-3"><input type="checkbox" checked={secondaryRail} onChange={(event) => setSecondaryRail(event.target.checked)} /> Show secondary rail</label>
              <label className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-950/80 p-3"><input type="checkbox" checked={denseMode} onChange={(event) => setDenseMode(event.target.checked)} /> Use dense content mode</label>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
                <div className="text-xs uppercase tracking-wide text-slate-500">Surface snapshot</div>
                <p className="mt-2">Width: {surface.width}px</p>
                <p className="mt-2">Primary action: {surface.primaryAction}</p>
                <p className="mt-2">Rail allowed: {surface.secondaryRailAllowed ? "yes" : "no"}</p>
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
                <div className="text-xs uppercase tracking-wide text-slate-500">Content order</div>
                <ul className="mt-2 space-y-2">{surface.contentOrder.map((item) => <li key={item}>• {item}</li>)}</ul>
              </div>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4"><div className="text-xs uppercase tracking-wide text-slate-500">Composition guidance</div><p className="mt-2">{composition}</p></div>
          </article>
          <aside className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/70 p-5 text-sm text-slate-300">
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4"><div className="text-xs uppercase tracking-wide text-slate-500">Thumb reach review</div><p className="mt-2">{thumbReach}</p></div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4"><div className="text-xs uppercase tracking-wide text-slate-500">Practices</div><ul className="mt-2 space-y-2">{mobileFirstPractices.map((item) => <li key={item}>• {item}</li>)}</ul></div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4"><div className="text-xs uppercase tracking-wide text-slate-500">Warnings</div><ul className="mt-2 space-y-2">{layoutWarnings.map((item) => <li key={item.issue}><span className="font-medium text-slate-100">{item.issue}:</span> {item.action}</li>)}</ul></div>
          </aside>
        </div>
      </section>
    </main>
  );
}
