"use client";

import { useEffect, useState } from "react";

type OrderRecord = { id: string; total: string; status: string; refundState: string };
type PageState = { filter: "all" | "active" | "refunded"; orders: OrderRecord[]; summary: { visible: number }; lastMessage: string };

export default function Page() {
  const [state, setState] = useState<PageState | null>(null);

  async function refresh() {
    const response = await fetch("/api/order-history-ui/state");
    setState((await response.json()) as PageState);
  }

  async function act(value: "all" | "active" | "refunded") {
    const response = await fetch("/api/order-history-ui/action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "switch-filter", value })
    });
    setState((await response.json()) as PageState);
  }

  useEffect(() => { void refresh(); }, []);

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <h1 className="text-3xl font-bold">Order History UI</h1>
      <p className="mt-2 text-slate-300">Browse historical orders, switch between active and refunded views, and expose follow-up status clearly.</p>
      <section className="mt-8 grid gap-6 lg:grid-cols-[280px,1fr]">
        <article className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 text-sm text-slate-300">
          <div className="grid gap-3">
            <button onClick={() => void act("all")} className="rounded bg-sky-600 px-4 py-2 text-sm font-semibold">All</button>
            <button onClick={() => void act("active")} className="rounded border border-slate-700 px-4 py-2 text-sm font-semibold">Active</button>
            <button onClick={() => void act("refunded")} className="rounded border border-slate-700 px-4 py-2 text-sm font-semibold">Refunded</button>
          </div>
          <div className="mt-5 rounded border border-slate-800 px-3 py-2 text-xs text-slate-400">visible orders: {state?.summary.visible ?? 0}</div>
          <p className="mt-4 text-slate-400">{state?.lastMessage}</p>
        </article>
        <article className="space-y-3">
          {state?.orders.map((order) => (
            <div key={order.id} className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 text-sm text-slate-300">
              <div className="font-semibold text-slate-100">{order.id}</div>
              <div className="mt-1 text-xs text-slate-500">{order.total} · {order.status} · refund {order.refundState}</div>
            </div>
          ))}
        </article>
      </section>
    </main>
  );
}
