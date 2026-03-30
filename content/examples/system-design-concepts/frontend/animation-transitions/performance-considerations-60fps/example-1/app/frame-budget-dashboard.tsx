"use client";

import { useMemo, useState } from "react";

export function FrameBudgetDashboard() {
  const [script, setScript] = useState(5);
  const [layout, setLayout] = useState(4);
  const [paint, setPaint] = useState(3);
  const total = useMemo(() => script + layout + paint, [layout, paint, script]);

  return (
    <main className="mx-auto min-h-screen max-w-5xl p-8">
      <section className="rounded-3xl border border-slate-800 bg-slate-950/70 p-6">
        <p className="text-sm uppercase tracking-[0.25em] text-sky-300">Performance considerations (60fps)</p>
        <h1 className="mt-2 text-3xl font-semibold">Frame budget dashboard</h1>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {[ ["script", script, setScript], ["layout", layout, setLayout], ["paint", paint, setPaint] ].map(([name, value, setter]) => (
            <label key={name as string} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 text-sm text-slate-300">
              <div className="font-medium capitalize">{name as string}</div>
              <input className="mt-3 w-full" type="range" min="1" max="14" value={value as number} onChange={(event) => (setter as (value: number) => void)(Number(event.target.value))} />
              <div className="mt-2">{value as number}ms</div>
            </label>
          ))}
        </div>
        <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-900/60 p-4 text-sm text-slate-300">Total frame cost: {total.toFixed(1)}ms · {total <= 16.7 ? "within budget" : "janky"}</div>
      </section>
    </main>
  );
}
