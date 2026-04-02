"use client";

import { useEffect, useState } from "react";

type Item = {
  id: string;
  title: string;
  subtitle: string;
  status: string;
  detail: string;
  flagged: boolean;
};

type Snapshot = {
  title: string;
  primaryLabel: string;
  secondaryLabel: string;
  primaryValue: string;
  secondaryValue: string;
  notes: string[];
  items: Item[];
  message: string;
};

export default function Page() {
  const [snapshot, setSnapshot] = useState<Snapshot | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  async function reload(action = "state", itemId?: string) {
    const url = action === "state" ? "/api/media-sharing-chat/state" : "/api/media-sharing-chat/action";
    const response = await fetch(url, action === "state" ? { cache: "no-store" } : {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, itemId })
    });
    const data = (await response.json()) as Snapshot;
    setSnapshot(data);
    setSelectedId((current) => current ?? data.items[0]?.id ?? null);
  }

  useEffect(() => { void reload(); }, []);

  const selected = snapshot?.items.find((item) => item.id === selectedId) ?? snapshot?.items[0] ?? null;

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="text-3xl font-bold">Media Sharing Chat</h1>
      <p className="mt-2 max-w-3xl text-slate-300">Covers staged uploads, derivative processing, and send-state recovery when media messages degrade.</p>
      <section className="mt-8 grid gap-4 lg:grid-cols-[2fr_1fr]">
        <article className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
          <div className="flex flex-wrap gap-3">
            <button onClick={() => void reload("cycle-primary")} className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-semibold">Cycle thread lane</button>
            <button onClick={() => void reload("cycle-secondary")} className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-semibold">Cycle composer mode</button>
            <button onClick={() => void reload("reset")} className="rounded-lg border border-emerald-700 px-4 py-2 text-sm font-semibold">Reset workflow</button>
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4"><p className="text-xs uppercase tracking-[0.2em] text-slate-400">{snapshot?.primaryLabel}</p><p className="mt-2 text-lg font-semibold">{snapshot?.primaryValue}</p></div>
            <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4"><p className="text-xs uppercase tracking-[0.2em] text-slate-400">{snapshot?.secondaryLabel}</p><p className="mt-2 text-lg font-semibold">{snapshot?.secondaryValue}</p></div>
          </div>
          <p className="mt-4 rounded-xl border border-slate-800 bg-slate-950/70 px-4 py-3 text-sm text-slate-300">{snapshot?.message}</p>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {(snapshot?.items ?? []).map((item) => (
              <button key={item.id} onClick={() => setSelectedId(item.id)} className={(selected?.id === item.id ? "border-sky-500 bg-sky-500/10" : "border-slate-800 bg-slate-950/70") + " rounded-2xl border p-4 text-left"}>
                <p className="font-semibold">{item.title}</p>
                <p className="mt-1 text-sm text-slate-400">{item.subtitle}</p>
                <p className="mt-3 text-sm text-slate-300">{item.detail}</p>
              </button>
            ))}
          </div>
        </article>
        <article className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
          <h2 className="text-lg font-semibold">Selected thread</h2>
          {selected ? (
            <>
              <p className="mt-4 text-sm text-slate-400">{selected.subtitle}</p>
              <p className="mt-2 text-xl font-semibold">{selected.title}</p>
              <p className="mt-3 text-sm leading-6 text-slate-300">{selected.detail}</p>
              <p className="mt-4 text-sm text-slate-400">State</p>
              <p className="mt-1 font-semibold">{selected.status}</p>
              <button onClick={() => void reload("advance-selected", selected.id)} className="mt-5 rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold">Advance thread</button>
            </>
          ) : null}
          <h3 className="mt-8 text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">Operational notes</h3>
          <ul className="mt-3 space-y-3 text-sm text-slate-300">{(snapshot?.notes ?? []).map((note) => <li key={note} className="rounded-xl border border-slate-800 bg-slate-950/70 px-3 py-3">{note}</li>)}</ul>
        </article>
      </section>
    </main>
  );
}
