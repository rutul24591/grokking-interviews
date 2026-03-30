"use client";

import { useState } from "react";

const presets = {
  subtle: { duration: "150ms", easing: "ease-out", note: "Good for hover and focus transitions." },
  expressive: { duration: "280ms", easing: "cubic-bezier(0.22, 1, 0.36, 1)", note: "Better for enter/exit emphasis." },
  reduced: { duration: "0ms", easing: "linear", note: "Respect reduced-motion preferences for non-essential movement." },
} as const;

export function CssMotionBoard() {
  const [preset, setPreset] = useState<keyof typeof presets>("subtle");
  const current = presets[preset];

  return (
    <main className="mx-auto min-h-screen max-w-6xl p-8">
      <section className="rounded-3xl border border-slate-800 bg-slate-950/70 p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-sky-300">CSS transitions and animations</p>
            <h1 className="mt-2 text-3xl font-semibold">Motion review board</h1>
            <p className="mt-2 max-w-3xl text-sm text-slate-400">Use CSS transitions for state-to-state continuity and keyframes for more expressive staged motion. Review timing choices with reduced-motion policy in the same surface.</p>
          </div>
          <select className="rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3" value={preset} onChange={(event) => setPreset(event.target.value as keyof typeof presets)}>
            <option value="subtle">Subtle UI transitions</option>
            <option value="expressive">Expressive keyframes</option>
            <option value="reduced">Reduced motion</option>
          </select>
        </div>
        <div className="mt-6 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <article className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
            <h2 className="text-lg font-medium">Interaction sample</h2>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-slate-700 bg-slate-950 p-4 transition hover:-translate-y-1 hover:scale-[1.02]" style={{ transitionDuration: current.duration, transitionTimingFunction: current.easing }}>
                Transition-driven card
              </div>
              <div className="rounded-2xl border border-slate-700 bg-slate-950 p-4" style={{ animation: preset === "expressive" ? "pulse 1.2s ease-in-out infinite" : "none" }}>
                Keyframe attention state
              </div>
            </div>
          </article>
          <aside className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
            <h2 className="text-lg font-medium">Current preset</h2>
            <p className="mt-3 text-sm text-slate-300">duration={current.duration} · easing={current.easing}</p>
            <p className="mt-3 text-sm text-slate-400">{current.note}</p>
          </aside>
        </div>
      </section>
      <style jsx global>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.04); opacity: 0.88; }
        }
      `}</style>
    </main>
  );
}
