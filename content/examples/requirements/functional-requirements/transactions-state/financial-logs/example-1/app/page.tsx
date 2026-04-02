"use client";

import { useEffect, useState } from "react";

type LogEntry = { id: string; kind: string; amount: string; ledgerState: string };
type PageState = {
  window: "day" | "week";
  entries: LogEntry[];
  summary: { reconciling: number };
  lastMessage: string;
};

export default function Page() {
  const [state, setState] = useState<PageState | null>(null);

  async function refresh() {
    const response = await fetch("/api/financial-logs/state");
    setState((await response.json()) as PageState);
  }

  async function switchWindow() {
    const response = await fetch("/api/financial-logs/action", { method: "POST" });
    setState((await response.json()) as PageState);
  }

  useEffect(() => { void refresh(); }, []);

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <h1 className="text-3xl font-bold">Financial Logs</h1>
      <p className="mt-2 text-slate-300">Inspect immutable ledger entries, switch audit windows, and surface reconciliation work still in progress.</p>
      <section className="mt-8 grid gap-6 lg:grid-cols-[280px,1fr]">
        <article className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 text-sm text-slate-300">
          <button onClick={switchWindow} className="rounded bg-sky-600 px-4 py-2 text-sm font-semibold">Switch window</button>
          <div className="mt-5 grid gap-3 text-xs text-slate-400">
            <div className="rounded border border-slate-800 px-3 py-2">window: {state?.window}</div>
            <div className="rounded border border-slate-800 px-3 py-2">reconciling: {state?.summary.reconciling}</div>
          </div>
          <p className="mt-4 text-slate-400">{state?.lastMessage}</p>
        </article>
        <article className="space-y-3">
          {state?.entries.map((entry) => (
            <div key={entry.id} className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 text-sm text-slate-300">
              <div className="font-semibold text-slate-100">{entry.kind}</div>
              <div className="mt-1 text-xs text-slate-500">{entry.amount} · {entry.ledgerState}</div>
            </div>
          ))}
        </article>
      </section>
    </main>
  );
}
