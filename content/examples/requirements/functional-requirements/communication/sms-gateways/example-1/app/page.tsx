"use client";

import { useEffect, useState } from "react";

type Item = { id: string; title: string; subtitle: string; status: string; detail: string; flagged: boolean; };
type Snapshot = { title: string; primaryLabel: string; secondaryLabel: string; primaryValue: string; secondaryValue: string; notes: string[]; items: Item[]; message: string; };

export default function Page() {
  const [snapshot, setSnapshot] = useState<Snapshot | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  async function act(action = "state", itemId?: string) {
    const response = await fetch(action === "state" ? "/api/sms-gateways/state" : "/api/sms-gateways/action", action === "state" ? { cache: "no-store" } : { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action, itemId }) });
    const data = (await response.json()) as Snapshot;
    setSnapshot(data);
    setSelectedId((current) => current ?? data.items[0]?.id ?? null);
  }
  useEffect(() => { void act(); }, []);
  const selected = snapshot?.items.find((item) => item.id === selectedId) ?? snapshot?.items[0] ?? null;
  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="text-3xl font-bold">SMS Gateways</h1>
      <p className="mt-2 max-w-3xl text-slate-300">Covers regional carrier routing, rate-limit fallback, and rejection handling for SMS delivery.</p>
      <section className="mt-8 grid gap-4 lg:grid-cols-[1.7fr_1fr]">
        <article className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
          <div className="grid gap-4 md:grid-cols-3">
            <button onClick={() => void act("cycle-primary")} className="rounded-xl bg-sky-600 px-4 py-3 text-sm font-semibold">Cycle dispatch lane</button>
            <button onClick={() => void act("cycle-secondary")} className="rounded-xl border border-slate-700 px-4 py-3 text-sm font-semibold">Cycle provider or channel</button>
            <button onClick={() => void act("reset")} className="rounded-xl border border-emerald-700 px-4 py-3 text-sm font-semibold">Reset dispatch</button>
          </div>
          <div className="mt-5 rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
            <p className="text-sm text-slate-400">Current routing</p>
            <div className="mt-3 flex flex-wrap gap-3 text-sm">
              <span className="rounded-full bg-slate-800 px-3 py-1">{snapshot?.primaryLabel}: {snapshot?.primaryValue}</span>
              <span className="rounded-full bg-slate-800 px-3 py-1">{snapshot?.secondaryLabel}: {snapshot?.secondaryValue}</span>
            </div>
            <p className="mt-4 text-sm text-slate-300">{snapshot?.message}</p>
          </div>
          <div className="mt-6 space-y-3">
            {(snapshot?.items ?? []).map((item) => (
              <button key={item.id} onClick={() => setSelectedId(item.id)} className={(selected?.id === item.id ? "border-sky-500 bg-sky-500/10" : "border-slate-800 bg-slate-950/70") + " block w-full rounded-2xl border p-4 text-left"}>
                <div className="flex items-center justify-between gap-3"><div><p className="font-semibold">{item.title}</p><p className="mt-1 text-sm text-slate-400">{item.subtitle}</p></div><span className="rounded-full bg-slate-800 px-2 py-1 text-xs uppercase">{item.status}</span></div>
                <p className="mt-3 text-sm text-slate-300">{item.detail}</p>
              </button>
            ))}
          </div>
        </article>
        <article className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
          <h2 className="text-lg font-semibold">Selected delivery path</h2>
          {selected ? <><p className="mt-4 text-sm text-slate-400">{selected.subtitle}</p><p className="mt-2 text-xl font-semibold">{selected.title}</p><p className="mt-3 text-sm leading-6 text-slate-300">{selected.detail}</p><button onClick={() => void act("advance-selected", selected.id)} className="mt-5 rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold">Advance delivery</button></> : null}
          <h3 className="mt-8 text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">Routing notes</h3>
          <ul className="mt-3 space-y-3 text-sm text-slate-300">{(snapshot?.notes ?? []).map((note) => <li key={note} className="rounded-xl border border-slate-800 bg-slate-950/70 px-3 py-3">{note}</li>)}</ul>
        </article>
      </section>
    </main>
  );
}
