"use client";
import { useEffect, useMemo, useState } from "react";

type Segment = { id: string; label: string; value: number; region: string };
type InteractiveState = { hoveredId: string; selectedId: string; brushRange: string; segments: Segment[]; lastMessage: string };

export default function Page() {
  const [state, setState] = useState<InteractiveState | null>(null);

  async function refresh() {
    const response = await fetch("/api/interactive/state");
    setState((await response.json()) as InteractiveState);
  }

  async function selectSegment(selectedId: string) {
    const response = await fetch("/api/interactive/select", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ selectedId })
    });
    setState((await response.json()) as InteractiveState);
  }

  useEffect(() => { void refresh(); }, []);
  const selected = useMemo(() => state?.segments.find((segment) => segment.id === state.selectedId), [state]);

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="text-3xl font-bold">Interactive Visualizations</h1>
      <p className="mt-2 text-slate-300">Let users inspect, select, and drill into data while preserving the active analytical context.</p>
      <section className="mt-8 grid gap-6 lg:grid-cols-[1fr,320px]">
        <article className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
          <div className="mb-4 text-sm text-slate-400">Brush range: {state?.brushRange}</div>
          <div className="grid gap-4 md:grid-cols-3">
            {state?.segments.map((segment) => (
              <button key={segment.id} onClick={() => void selectSegment(segment.id)} className={`rounded-xl border p-5 text-left text-sm ${state?.selectedId === segment.id ? "border-sky-500 bg-sky-950/30" : "border-slate-800 bg-slate-950/40"}`}>
                <div className="font-semibold text-slate-100">{segment.label}</div>
                <div className="mt-2 text-slate-400">Value: {segment.value}</div>
                <div className="mt-1 text-slate-500">Region: {segment.region}</div>
              </button>
            ))}
          </div>
        </article>
        <article className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 text-sm text-slate-300">
          <div className="text-xs uppercase tracking-wide text-slate-500">Selected segment</div>
          <div className="mt-2 font-semibold text-slate-100">{selected?.label}</div>
          <div className="mt-3 rounded border border-slate-800 px-3 py-3 text-slate-400">Region: {selected?.region}</div>
          <div className="mt-3 rounded border border-slate-800 px-3 py-3 text-slate-400">Contribution: {selected?.value}</div>
          <p className="mt-4 text-slate-400">{state?.lastMessage}</p>
        </article>
      </section>
    </main>
  );
}
