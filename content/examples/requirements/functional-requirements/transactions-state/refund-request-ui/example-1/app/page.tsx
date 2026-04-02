"use client";

import { useEffect, useState } from "react";

type Refund = { id: string; orderId: string; reason: string; status: string; eligible: boolean };
type PageState = { refunds: Refund[]; draftReason: string; summary: { pending: number }; lastMessage: string };

export default function Page() {
  const [state, setState] = useState<PageState | null>(null);

  async function refresh() {
    const response = await fetch("/api/refund-request-ui/state");
    setState((await response.json()) as PageState);
  }

  async function act(type: "submit-refund" | "advance-refund", value?: string) {
    const response = await fetch("/api/refund-request-ui/action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, value })
    });
    setState((await response.json()) as PageState);
  }

  useEffect(() => { void refresh(); }, []);

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <h1 className="text-3xl font-bold">Refund Request UI</h1>
      <p className="mt-2 text-slate-300">Submit refunds, track review progress, and expose whether the request remains eligible.</p>
      <section className="mt-8 grid gap-6 lg:grid-cols-[280px,1fr]">
        <article className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 text-sm text-slate-300">
          <button onClick={() => void act("submit-refund")} className="rounded bg-sky-600 px-4 py-2 text-sm font-semibold">Submit refund</button>
          <div className="mt-5 rounded border border-slate-800 px-3 py-2 text-xs text-slate-400">pending reviews: {state?.summary.pending ?? 0}</div>
          <p className="mt-4 text-slate-400">{state?.lastMessage}</p>
        </article>
        <article className="space-y-3">
          {state?.refunds.map((refund) => (
            <div key={refund.id} className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 text-sm text-slate-300">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="font-semibold text-slate-100">{refund.orderId}</div>
                  <div className="mt-1 text-xs text-slate-500">{refund.reason} · {refund.status}</div>
                </div>
                <button onClick={() => void act("advance-refund", refund.id)} className="rounded border border-slate-700 px-3 py-2 text-xs font-semibold">Advance</button>
              </div>
              <div className="mt-3 rounded border border-slate-800 px-3 py-2 text-xs text-slate-400">eligible: {String(refund.eligible)}</div>
            </div>
          ))}
        </article>
      </section>
    </main>
  );
}
