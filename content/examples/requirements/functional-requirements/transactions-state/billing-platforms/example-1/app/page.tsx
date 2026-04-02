"use client";

import { useEffect, useMemo, useState } from "react";

type BillingAccount = {
  id: string;
  customer: string;
  provider: string;
  invoiceStatus: string;
  dunningStage: string;
  retryEligible: boolean;
};

type BillingState = {
  strategy: "stripe-primary" | "adyen-primary" | "hybrid";
  summary: { retryEligible: number; failed: number };
  accounts: BillingAccount[];
  lastMessage: string;
};

export default function Page() {
  const [state, setState] = useState<BillingState | null>(null);
  const [selectedAccount, setSelectedAccount] = useState<string>("acct-2");

  async function refresh() {
    const response = await fetch("/api/billing-platforms/state");
    setState((await response.json()) as BillingState);
  }

  async function act(type: "switch-strategy" | "retry-invoice", value?: string) {
    const response = await fetch("/api/billing-platforms/action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, value })
    });
    setState((await response.json()) as BillingState);
  }

  useEffect(() => {
    void refresh();
  }, []);

  const selected = state?.accounts.find((account) => account.id === selectedAccount) ?? state?.accounts[0] ?? null;
  const routingNotes = useMemo(() => {
    if (!state) return [];
    return [
      `${state.summary.failed} failed invoices currently need attention.`,
      `${state.summary.retryEligible} invoices can be retried without operator intervention.`,
      state.strategy === "hybrid" ? "Hybrid routing keeps a fallback processor on the hot path." : `Primary routing is pinned to ${state.strategy}.`
    ];
  }, [state]);

  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <h1 className="text-3xl font-bold">Billing Platforms Console</h1>
      <p className="mt-2 text-slate-300">Operate provider routing, inspect invoice failures, and decide when retries stay automatic versus when finance needs to step in.</p>
      <section className="mt-8 grid gap-6 xl:grid-cols-[320px,1fr,320px]">
        <article className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 text-sm text-slate-300">
          <h2 className="text-base font-semibold text-slate-100">Routing controls</h2>
          <div className="mt-4 grid gap-3">
            <button onClick={() => void act("switch-strategy", "stripe-primary")} className="rounded bg-sky-600 px-4 py-2 text-sm font-semibold">Stripe primary</button>
            <button onClick={() => void act("switch-strategy", "adyen-primary")} className="rounded border border-slate-700 px-4 py-2 text-sm font-semibold">Adyen primary</button>
            <button onClick={() => void act("switch-strategy", "hybrid")} className="rounded border border-slate-700 px-4 py-2 text-sm font-semibold">Hybrid failover</button>
          </div>
          <div className="mt-5 grid gap-3 text-xs text-slate-400">
            <div className="rounded border border-slate-800 px-3 py-2">routing: {state?.strategy}</div>
            <div className="rounded border border-slate-800 px-3 py-2">failed invoices: {state?.summary.failed ?? 0}</div>
            <div className="rounded border border-slate-800 px-3 py-2">retry eligible: {state?.summary.retryEligible ?? 0}</div>
          </div>
          <ul className="mt-4 grid gap-2 text-xs text-slate-400">
            {routingNotes.map((note) => (
              <li key={note} className="rounded border border-slate-800 px-3 py-2">{note}</li>
            ))}
          </ul>
          <p className="mt-4 text-slate-400">{state?.lastMessage}</p>
        </article>
        <article className="space-y-4">
          {state?.accounts.map((account) => (
            <button
              key={account.id}
              type="button"
              onClick={() => setSelectedAccount(account.id)}
              className={`w-full rounded-xl border p-5 text-left text-sm ${selected?.id === account.id ? "border-sky-500 bg-slate-900" : "border-slate-800 bg-slate-900/60"}`}
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="font-semibold text-slate-100">{account.customer}</div>
                  <div className="mt-1 text-xs text-slate-500">{account.provider}</div>
                </div>
                <button
                  onClick={(event) => {
                    event.stopPropagation();
                    void act("retry-invoice", account.id);
                  }}
                  disabled={!account.retryEligible}
                  className="rounded border border-slate-700 px-3 py-2 text-xs font-semibold disabled:opacity-40"
                >
                  Retry invoice
                </button>
              </div>
              <div className="mt-3 grid gap-2 md:grid-cols-2">
                <div className="rounded border border-slate-800 px-3 py-2">invoice: {account.invoiceStatus}</div>
                <div className="rounded border border-slate-800 px-3 py-2">dunning: {account.dunningStage}</div>
              </div>
            </button>
          ))}
        </article>
        <article className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 text-sm text-slate-300">
          <h2 className="text-base font-semibold text-slate-100">Selected account workflow</h2>
          {selected ? (
            <div className="mt-4 grid gap-3">
              <div className="rounded border border-slate-800 px-3 py-2">customer: {selected.customer}</div>
              <div className="rounded border border-slate-800 px-3 py-2">provider path: {selected.provider}</div>
              <div className="rounded border border-slate-800 px-3 py-2">invoice status: {selected.invoiceStatus}</div>
              <div className="rounded border border-slate-800 px-3 py-2">dunning stage: {selected.dunningStage}</div>
              <div className="rounded border border-slate-800 px-3 py-2">operator action: {selected.retryEligible ? "retry can stay self-serve" : "manual reconciliation required"}</div>
            </div>
          ) : null}
        </article>
      </section>
    </main>
  );
}
