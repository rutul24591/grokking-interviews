"use client";

import { useEffect, useState } from "react";

type FraudCase = { id: string; orderId: string; score: number; decision: string; signal: string };
type PageState = { cases: FraudCase[]; summary: { blocked: number; review: number }; lastMessage: string };

export default function Page() {
  const [state, setState] = useState<PageState | null>(null);

  async function refresh() {
    const response = await fetch("/api/transaction-fraud-detection/state");
    setState((await response.json()) as PageState);
  }

  async function act(type: "escalate-review" | "clear-case", value?: string) {
    const response = await fetch("/api/transaction-fraud-detection/action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, value })
    });
    setState((await response.json()) as PageState);
  }

  useEffect(() => { void refresh(); }, []);

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <h1 className="text-3xl font-bold">Transaction Fraud Detection</h1>
      <p className="mt-2 text-slate-300">Inspect fraud signals, escalate suspicious payments, and clear safe transactions with visible reasoning.</p>
      <section className="mt-8 grid gap-6 lg:grid-cols-[280px,1fr]">
        <article className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 text-sm text-slate-300">
          <div className="grid gap-3 text-xs text-slate-400">
            <div className="rounded border border-slate-800 px-3 py-2">blocked: {state?.summary.blocked ?? 0}</div>
            <div className="rounded border border-slate-800 px-3 py-2">in review: {state?.summary.review ?? 0}</div>
          </div>
          <p className="mt-4 text-slate-400">{state?.lastMessage}</p>
        </article>
        <article className="space-y-3">
          {state?.cases.map((entry) => (
            <div key={entry.id} className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 text-sm text-slate-300">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="font-semibold text-slate-100">{entry.orderId}</div>
                  <div className="mt-1 text-xs text-slate-500">score {entry.score} · {entry.signal}</div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => void act("escalate-review", entry.id)} className="rounded border border-slate-700 px-3 py-2 text-xs font-semibold">Escalate</button>
                  <button onClick={() => void act("clear-case", entry.id)} className="rounded border border-slate-700 px-3 py-2 text-xs font-semibold">Clear</button>
                </div>
              </div>
              <div className="mt-3 rounded border border-slate-800 px-3 py-2 text-xs text-slate-400">decision: {entry.decision}</div>
            </div>
          ))}
        </article>
      </section>
    </main>
  );
}
