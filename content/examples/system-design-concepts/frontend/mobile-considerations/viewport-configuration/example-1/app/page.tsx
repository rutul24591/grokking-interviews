"use client";

import { useMemo, useState } from "react";
import { viewportConfigs, viewportPlaybook, viewportRules } from "@/lib/store";

export default function Page() {
  const [selected, setSelected] = useState(0);
  const [keyboardOpen, setKeyboardOpen] = useState(false);
  const [denseContent, setDenseContent] = useState(true);
  const config = viewportConfigs[selected];

  const safetyReview = useMemo(() => {
    if (!config.userScalable && (config.formHeavy || denseContent)) return "This viewport is unsafe. Restore zoom before shipping to mobile forms or dense reading screens.";
    if (!config.safeAreaAware) return "Safe-area handling is incomplete. Notched devices will clip headers or bottom actions.";
    return "Viewport settings are safe for the current mobile surface.";
  }, [config, denseContent]);

  const keyboardPlan = useMemo(() => {
    if (!keyboardOpen) return "Keyboard closed. Sticky elements can stay in their default position.";
    if (config.fixedHeader) return "Move sticky controls relative to the visual viewport so the keyboard does not hide inputs.";
    return "Avoid new fixed layers while the keyboard is open and keep focused fields centered.";
  }, [config, keyboardOpen]);

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-6 py-10 text-slate-100">
      <section className="rounded-3xl border border-slate-800 bg-slate-950/80 p-6">
        <p className="text-sm uppercase tracking-[0.25em] text-indigo-300">Mobile considerations</p>
        <h1 className="mt-2 text-3xl font-semibold">Viewport configuration console</h1>
        <p className="mt-3 max-w-3xl text-sm text-slate-300">Review viewport meta decisions, zoom safety, keyboard overlap, and safe-area handling for mobile pages.</p>
        <div className="mt-6 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <article className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/70 p-5 text-sm text-slate-300">
            <select value={selected} onChange={(event) => setSelected(Number(event.target.value))} className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3">
              {viewportConfigs.map((item, index) => <option key={item.id} value={index}>{item.label}</option>)}
            </select>
            <div className="grid gap-3 md:grid-cols-2">
              <label className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-950/80 p-3"><input type="checkbox" checked={keyboardOpen} onChange={(event) => setKeyboardOpen(event.target.checked)} /> Keyboard open</label>
              <label className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-950/80 p-3"><input type="checkbox" checked={denseContent} onChange={(event) => setDenseContent(event.target.checked)} /> Dense mobile content</label>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
                <div className="text-xs uppercase tracking-wide text-slate-500">Viewport config</div>
                <p className="mt-2">width={config.width}</p>
                <p className="mt-2">initial-scale={config.initialScale}</p>
                <p className="mt-2">user-scalable={String(config.userScalable)}</p>
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
                <div className="text-xs uppercase tracking-wide text-slate-500">Page constraints</div>
                <p className="mt-2">Safe area ready: {config.safeAreaAware ? "yes" : "no"}</p>
                <p className="mt-2">Fixed header: {config.fixedHeader ? "yes" : "no"}</p>
                <p className="mt-2">Form heavy: {config.formHeavy ? "yes" : "no"}</p>
              </div>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4"><div className="text-xs uppercase tracking-wide text-slate-500">Safety review</div><p className="mt-2">{safetyReview}</p></div>
          </article>
          <aside className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/70 p-5 text-sm text-slate-300">
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4"><div className="text-xs uppercase tracking-wide text-slate-500">Keyboard plan</div><p className="mt-2">{keyboardPlan}</p></div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4"><div className="text-xs uppercase tracking-wide text-slate-500">Rules</div><ul className="mt-2 space-y-2">{viewportRules.map((item) => <li key={item}>• {item}</li>)}</ul></div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4"><div className="text-xs uppercase tracking-wide text-slate-500">Playbook</div><ul className="mt-2 space-y-2">{viewportPlaybook.map((item) => <li key={item.issue}><span className="font-medium text-slate-100">{item.issue}:</span> {item.action}</li>)}</ul></div>
          </aside>
        </div>
      </section>
    </main>
  );
}
