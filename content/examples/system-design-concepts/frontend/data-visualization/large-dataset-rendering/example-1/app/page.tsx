"use client";
import { useEffect, useState } from "react";

type Slice = {
  bucket: string;
  points: number;
  strategy: "raw" | "aggregated" | "downsampled";
  preservesExtrema: boolean;
  queryCost: "low" | "medium" | "high";
};
type DatasetState = {
  totalPoints: number;
  viewportWidth: number;
  activeWindow: string;
  estimatedFrameMs: number;
  slices: Slice[];
  lastMessage: string;
};

export default function Page() {
  const [state, setState] = useState<DatasetState | null>(null);

  async function refresh() {
    const response = await fetch("/api/large-dataset/state");
    setState((await response.json()) as DatasetState);
  }

  async function updateWindow(viewportWidth: number) {
    const response = await fetch("/api/large-dataset/window", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ viewportWidth })
    });
    setState((await response.json()) as DatasetState);
  }

  useEffect(() => { void refresh(); }, []);

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="text-3xl font-bold">Large Dataset Rendering</h1>
      <p className="mt-2 text-slate-300">Window, aggregate, and downsample large datasets before rendering so the UI remains responsive.</p>
      <section className="mt-8 grid gap-6 lg:grid-cols-[320px,1fr]">
        <article className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 text-sm text-slate-300">
          <div className="rounded-lg border border-slate-800 p-4">
            <div className="text-xs uppercase tracking-wide text-slate-500">Total points</div>
            <div className="mt-2 font-semibold text-slate-100">{state?.totalPoints}</div>
            <div className="mt-3 text-slate-400">Viewport: {state?.viewportWidth}px</div>
          </div>
          <div className="mt-4 grid gap-3">
            <div className="rounded-lg border border-slate-800 px-3 py-3">Active window <span className="font-semibold text-slate-100">{state?.activeWindow}</span></div>
            <div className="rounded-lg border border-slate-800 px-3 py-3">Estimated frame <span className="font-semibold text-slate-100">{state?.estimatedFrameMs}ms</span></div>
          </div>
          <div className="mt-4 flex flex-wrap gap-3">
            <button onClick={() => void updateWindow(360)} className="rounded bg-sky-600 px-4 py-2 text-sm font-semibold hover:bg-sky-500">Mobile</button>
            <button onClick={() => void updateWindow(768)} className="rounded border border-slate-700 px-4 py-2 text-sm font-semibold">Tablet</button>
            <button onClick={() => void updateWindow(1280)} className="rounded border border-slate-700 px-4 py-2 text-sm font-semibold">Desktop</button>
          </div>
          <p className="mt-4 text-slate-400">{state?.lastMessage}</p>
        </article>
        <article className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
          <ul className="space-y-3 text-sm text-slate-300">
            {state?.slices.map((slice) => (
              <li key={slice.bucket} className="rounded border border-slate-800 px-3 py-3">
                <div className="flex items-center justify-between"><span className="font-semibold text-slate-100">{slice.bucket}</span><span>{slice.points} points</span></div>
                <div className="mt-2 grid gap-2 md:grid-cols-3 text-slate-400">
                  <div>strategy: {slice.strategy}</div>
                  <div>extrema: {String(slice.preservesExtrema)}</div>
                  <div>query cost: {slice.queryCost}</div>
                </div>
              </li>
            ))}
          </ul>
        </article>
      </section>
    </main>
  );
}
