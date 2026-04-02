"use client";

import { useEffect, useState } from "react";

type Subscription = { id: string; customer: string; renewalState: string; retryEligible: boolean; nextBillDate: string };
type PageState = { subscriptions: Subscription[]; summary: { retryEligible: number }; lastMessage: string };

export default function Page() {
  const [state, setState] = useState<PageState | null>(null);

  async function refresh() {
    const response = await fetch("/api/subscription-billing/state");
    setState((await response.json()) as PageState);
  }

  async function act(type: "bill-subscription" | "retry-subscription", value?: string) {
    const response = await fetch("/api/subscription-billing/action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, value })
    });
    setState((await response.json()) as PageState);
  }

  useEffect(() => { void refresh(); }, []);

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <h1 className="text-3xl font-bold">Subscription Billing</h1>
      <p className="mt-2 text-slate-300">Run renewal billing, retry failed subscriptions, and expose the next renewal date for operators.</p>
      <section className="mt-8 grid gap-6 lg:grid-cols-[280px,1fr]">
        <article className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 text-sm text-slate-300">
          <div className="rounded border border-slate-800 px-3 py-2 text-xs text-slate-400">retry eligible: {state?.summary.retryEligible ?? 0}</div>
          <p className="mt-4 text-slate-400">{state?.lastMessage}</p>
        </article>
        <article className="space-y-3">
          {state?.subscriptions.map((subscription) => (
            <div key={subscription.id} className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 text-sm text-slate-300">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="font-semibold text-slate-100">{subscription.customer}</div>
                  <div className="mt-1 text-xs text-slate-500">{subscription.renewalState} · next bill {subscription.nextBillDate}</div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => void act("bill-subscription", subscription.id)} className="rounded border border-slate-700 px-3 py-2 text-xs font-semibold">Bill</button>
                  <button onClick={() => void act("retry-subscription", subscription.id)} disabled={!subscription.retryEligible} className="rounded border border-slate-700 px-3 py-2 text-xs font-semibold disabled:opacity-40">Retry</button>
                </div>
              </div>
            </div>
          ))}
        </article>
      </section>
    </main>
  );
}
