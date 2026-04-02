"use client";

import { useEffect, useState } from "react";

type StorageRow = {
  id: string;
  entity: string;
  model: string;
  consistency: string;
  p95ReadMs: number;
  retention: string;
  recovery: string;
};

type StorageState = {
  view: "hot" | "warm" | "archive";
  rows: StorageRow[];
  tierNote: { writeRate: string; failover: string; consumers: string };
  lastMessage: string;
};

export default function Page() {
  const [state, setState] = useState<StorageState | null>(null);

  async function refresh() {
    const response = await fetch("/api/engagement-storage/state");
    setState((await response.json()) as StorageState);
  }

  async function act(view: StorageState["view"]) {
    const response = await fetch("/api/engagement-storage/action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ view })
    });
    setState((await response.json()) as StorageState);
  }

  useEffect(() => {
    void refresh();
  }, []);

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="text-3xl font-bold">Engagement Storage</h1>
      <p className="mt-2 text-slate-300">Inspect how recent and historical engagement data is stored so product counters and feeds read from the right tier.</p>
      <section className="mt-8 grid gap-6 lg:grid-cols-[320px,1fr]">
        <article className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 text-sm text-slate-300">
          <div className="flex flex-wrap gap-3">
            <button onClick={() => void act("hot")} className="rounded bg-sky-600 px-4 py-2 text-sm font-semibold">Hot</button>
            <button onClick={() => void act("warm")} className="rounded border border-slate-700 px-4 py-2 text-sm font-semibold">Warm</button>
            <button onClick={() => void act("archive")} className="rounded border border-slate-700 px-4 py-2 text-sm font-semibold">Archive</button>
          </div>
          <div className="mt-5 grid gap-3 text-xs text-slate-400">
            <div className="rounded border border-slate-800 px-3 py-2">write rate: {state?.tierNote.writeRate}</div>
            <div className="rounded border border-slate-800 px-3 py-2">failover: {state?.tierNote.failover}</div>
            <div className="rounded border border-slate-800 px-3 py-2">consumers: {state?.tierNote.consumers}</div>
          </div>
          <p className="mt-4 text-slate-400">{state?.lastMessage}</p>
        </article>
        <article className="space-y-4">
          {state?.rows.map((row) => (
            <div key={row.id} className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 text-sm text-slate-300">
              <div className="font-semibold text-slate-100">{row.entity}</div>
              <div className="mt-2 text-xs text-slate-500">model {row.model} · consistency {row.consistency}</div>
              <div className="mt-3 grid gap-2 md:grid-cols-3">
                <div className="rounded border border-slate-800 px-3 py-2">p95 read {row.p95ReadMs}ms</div>
                <div className="rounded border border-slate-800 px-3 py-2">retention {row.retention}</div>
                <div className="rounded border border-slate-800 px-3 py-2">recovery {row.recovery}</div>
              </div>
            </div>
          ))}
        </article>
      </section>
    </main>
  );
}
