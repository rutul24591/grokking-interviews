"use client";

import { useEffect, useState } from "react";

type InventoryItem = { id: string; label: string; available: number; reserved: number; oversellRisk: boolean };
type PageState = { items: InventoryItem[]; summary: { oversellRisk: number }; lastMessage: string };

export default function Page() {
  const [state, setState] = useState<PageState | null>(null);

  async function refresh() {
    const response = await fetch("/api/inventory-management/state");
    setState((await response.json()) as PageState);
  }

  async function act(type: "reserve" | "release", value?: string) {
    const response = await fetch("/api/inventory-management/action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, value })
    });
    setState((await response.json()) as PageState);
  }

  useEffect(() => { void refresh(); }, []);

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <h1 className="text-3xl font-bold">Inventory Management</h1>
      <p className="mt-2 text-slate-300">Reserve and release stock while watching oversell risk during checkout and booking flows.</p>
      <section className="mt-8 grid gap-6 lg:grid-cols-[280px,1fr]">
        <article className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 text-sm text-slate-300">
          <div className="rounded border border-slate-800 px-3 py-2 text-xs text-slate-400">oversell alerts: {state?.summary.oversellRisk ?? 0}</div>
          <p className="mt-4 text-slate-400">{state?.lastMessage}</p>
        </article>
        <article className="space-y-3">
          {state?.items.map((item) => (
            <div key={item.id} className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 text-sm text-slate-300">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="font-semibold text-slate-100">{item.label}</div>
                  <div className="mt-1 text-xs text-slate-500">available {item.available} · reserved {item.reserved}</div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => void act("reserve", item.id)} className="rounded border border-slate-700 px-3 py-2 text-xs font-semibold">Reserve</button>
                  <button onClick={() => void act("release", item.id)} className="rounded border border-slate-700 px-3 py-2 text-xs font-semibold">Release</button>
                </div>
              </div>
              <div className="mt-3 rounded border border-slate-800 px-3 py-2 text-xs text-slate-400">oversell risk: {String(item.oversellRisk)}</div>
            </div>
          ))}
        </article>
      </section>
    </main>
  );
}
