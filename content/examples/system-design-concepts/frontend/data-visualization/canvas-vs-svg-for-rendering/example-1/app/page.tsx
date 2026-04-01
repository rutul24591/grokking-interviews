"use client";
import { useEffect, useMemo, useState } from "react";

type Series = { label: string; value: number };
type RenderingState = {
  mode: "svg" | "canvas";
  pointCount: number;
  accessibilityNotes: string[];
  hitTesting: string;
  points: Series[];
  lastMessage: string;
};

export default function Page() {
  const [state, setState] = useState<RenderingState | null>(null);

  async function refresh() {
    const response = await fetch("/api/rendering/state");
    setState((await response.json()) as RenderingState);
  }

  async function switchMode(mode: "svg" | "canvas") {
    const response = await fetch("/api/rendering/mode", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mode })
    });
    setState((await response.json()) as RenderingState);
  }

  useEffect(() => {
    void refresh();
  }, []);

  const maxValue = useMemo(
    () => Math.max(...(state?.points.map((point) => point.value) ?? [1])),
    [state]
  );

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="text-3xl font-bold">Canvas vs SVG for Rendering</h1>
      <p className="mt-2 text-slate-300">
        Compare how the same analytics scene behaves when the product team optimizes for
        accessibility and interaction versus density and render throughput.
      </p>
      <section className="mt-8 grid gap-6 lg:grid-cols-[320px,1fr]">
        <article className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 text-sm text-slate-300">
          <div className="rounded-lg border border-slate-800 p-4">
            <div className="text-xs uppercase tracking-wide text-slate-500">Scene scale</div>
            <div className="mt-2 font-semibold text-slate-100">{state?.pointCount ?? 0} plotted nodes</div>
            <div className="mt-3 text-slate-400">Hit testing: {state?.hitTesting}</div>
          </div>
          <div className="mt-4 flex gap-3">
            <button onClick={() => void switchMode("svg")} className="rounded bg-sky-600 px-4 py-2 text-sm font-semibold hover:bg-sky-500">Use SVG</button>
            <button onClick={() => void switchMode("canvas")} className="rounded border border-slate-700 px-4 py-2 text-sm font-semibold">Use Canvas</button>
          </div>
          <ul className="mt-4 space-y-2 text-slate-400">
            {state?.accessibilityNotes.map((note) => <li key={note}>{note}</li>)}
          </ul>
          <p className="mt-4 text-slate-400">{state?.lastMessage}</p>
        </article>
        <article className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
          <div className="rounded-lg border border-slate-800 p-4">
            <div className="mb-4 text-sm text-slate-400">Active renderer: {state?.mode}</div>
            {state?.mode === "svg" ? (
              <svg viewBox="0 0 480 240" className="w-full rounded border border-slate-800 bg-slate-950 p-4">
                {state.points.map((point, index) => {
                  const width = (point.value / maxValue) * 320;
                  const y = 24 + index * 48;
                  return (
                    <g key={point.label}>
                      <text x="0" y={y + 18} fill="#cbd5e1" fontSize="14">{point.label}</text>
                      <rect x="120" y={y} width={width} height="24" rx="6" fill="#0ea5e9" />
                      <text x={130 + width} y={y + 18} fill="#e2e8f0" fontSize="14">{point.value}</text>
                    </g>
                  );
                })}
              </svg>
            ) : (
              <div className="rounded border border-slate-800 bg-slate-950 p-4">
                <div className="grid gap-3 md:grid-cols-2">
                  {state?.points.map((point) => (
                    <div key={point.label} className="rounded border border-slate-800 px-3 py-3 text-sm text-slate-300">
                      <div className="font-semibold text-slate-100">{point.label}</div>
                      <div className="mt-2 h-3 rounded bg-slate-800">
                        <div className="h-3 rounded bg-cyan-500" style={{ width: `${(point.value / maxValue) * 100}%` }} />
                      </div>
                      <div className="mt-2 text-slate-400">Canvas overlay handles hover math for {point.value} points.</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </article>
      </section>
    </main>
  );
}
