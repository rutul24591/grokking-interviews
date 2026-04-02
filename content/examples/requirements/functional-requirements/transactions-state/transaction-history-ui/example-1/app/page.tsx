"use client";

import { useEffect, useMemo, useState } from "react";

type Transaction = { id: string; amount: string; status: string; timeline: string };
type PageState = { filter: "all" | "failed" | "refunded"; transactions: Transaction[]; summary: { visible: number }; lastMessage: string };

export default function Page() {
  const [state, setState] = useState<PageState | null>(null);
  const [selectedId, setSelectedId] = useState<string>("txn-701");

  async function refresh() {
    const response = await fetch("/api/transaction-history-ui/state");
    setState((await response.json()) as PageState);
  }

  async function act(value: "all" | "failed" | "refunded") {
    const response = await fetch("/api/transaction-history-ui/action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "switch-filter", value })
    });
    setState((await response.json()) as PageState);
  }

  useEffect(() => { void refresh(); }, []);

  const selected = state?.transactions.find((transaction) => transaction.id === selectedId) ?? state?.transactions[0] ?? null;
  const metrics = useMemo(() => {
    if (!state) return { failed: 0, refunded: 0 };
    return {
      failed: state.transactions.filter((transaction) => transaction.status === "failed").length,
      refunded: state.transactions.filter((transaction) => transaction.status === "refunded").length
    };
  }, [state]);

  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <h1 className="text-3xl font-bold">Transaction History UI</h1>
      <p className="mt-2 text-slate-300">Browse transaction records, filter support-relevant outcomes, and inspect the timeline detail a finance or support workflow depends on.</p>
      <section className="mt-8 grid gap-6 xl:grid-cols-[280px,1fr,320px]">
        <article className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 text-sm text-slate-300">
          <div className="grid gap-3">
            <button onClick={() => void act("all")} className="rounded bg-sky-600 px-4 py-2 text-sm font-semibold">All</button>
            <button onClick={() => void act("failed")} className="rounded border border-slate-700 px-4 py-2 text-sm font-semibold">Failed</button>
            <button onClick={() => void act("refunded")} className="rounded border border-slate-700 px-4 py-2 text-sm font-semibold">Refunded</button>
          </div>
          <div className="mt-5 grid gap-3 text-xs text-slate-400">
            <div className="rounded border border-slate-800 px-3 py-2">visible records: {state?.summary.visible ?? 0}</div>
            <div className="rounded border border-slate-800 px-3 py-2">failed in current view: {metrics.failed}</div>
            <div className="rounded border border-slate-800 px-3 py-2">refunded in current view: {metrics.refunded}</div>
          </div>
          <p className="mt-4 text-slate-400">{state?.lastMessage}</p>
        </article>
        <article className="space-y-3">
          {state?.transactions.map((transaction) => (
            <button
              key={transaction.id}
              type="button"
              onClick={() => setSelectedId(transaction.id)}
              className={`w-full rounded-xl border p-4 text-left text-sm ${selected?.id === transaction.id ? "border-sky-500 bg-slate-900" : "border-slate-800 bg-slate-900/60"}`}
            >
              <div className="font-semibold text-slate-100">{transaction.id}</div>
              <div className="mt-1 text-xs text-slate-500">{transaction.amount} · {transaction.status}</div>
              <div className="mt-3 rounded border border-slate-800 px-3 py-2 text-xs text-slate-400">{transaction.timeline}</div>
            </button>
          ))}
        </article>
        <article className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 text-sm text-slate-300">
          <h2 className="text-base font-semibold text-slate-100">Selected record</h2>
          {selected ? (
            <div className="mt-4 grid gap-3">
              <div className="rounded border border-slate-800 px-3 py-2">transaction: {selected.id}</div>
              <div className="rounded border border-slate-800 px-3 py-2">status: {selected.status}</div>
              <div className="rounded border border-slate-800 px-3 py-2">amount: {selected.amount}</div>
              <div className="rounded border border-slate-800 px-3 py-2">timeline: {selected.timeline}</div>
              <div className="rounded border border-slate-800 px-3 py-2">support action: {selected.status === "failed" ? "offer retry or investigate payment decline" : selected.status === "refunded" ? "link refund audit trail" : "show receipt and settlement details"}</div>
            </div>
          ) : null}
        </article>
      </section>
    </main>
  );
}
