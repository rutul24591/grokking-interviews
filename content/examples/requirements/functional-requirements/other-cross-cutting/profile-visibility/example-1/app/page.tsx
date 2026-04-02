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
  summary: string;
  primaryLabel: string;
  secondaryLabel: string;
  primaryValue: string;
  secondaryValue: string;
  primaryActionLabel: string;
  secondaryActionLabel: string;
  advanceActionLabel: string;
  items: Item[];
  notes: string[];
  message: string;
};

export default function Page() {
  const [snapshot, setSnapshot] = useState<Snapshot | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  async function run(action = "state", itemId?: string) {
    const response = await fetch(
      action === "state" ? "/api/profile-visibility/state" : "/api/profile-visibility/action",
      action === "state"
        ? { cache: "no-store" }
        : {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action, itemId })
          }
    );
    const data = (await response.json()) as Snapshot;
    setSnapshot(data);
    setSelectedId((current) => current ?? data.items[0]?.id ?? null);
  }

  useEffect(() => {
    void run();
  }, []);

  const selected = snapshot?.items.find((item) => item.id === selectedId) ?? snapshot?.items[0] ?? null;

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <header className="space-y-3">
        <h1 className="text-3xl font-bold">{snapshot?.title ?? "Loading workflow..."}</h1>
        <p className="max-w-3xl text-slate-300">{snapshot?.summary}</p>
      </header>
      <section className="mt-8 grid gap-4 lg:grid-cols-[2fr_1fr]">
        <article className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
          <div className="flex flex-wrap gap-3">
            <button onClick={() => void run("cycle-primary")} className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-semibold">{snapshot?.primaryActionLabel}</button>
            <button onClick={() => void run("cycle-secondary")} className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-semibold">{snapshot?.secondaryActionLabel}</button>
            <button onClick={() => void run("reset")} className="rounded-lg border border-emerald-700 px-4 py-2 text-sm font-semibold">Reset workflow</button>
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{snapshot?.primaryLabel}</p>
              <p className="mt-2 text-lg font-semibold">{snapshot?.primaryValue}</p>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{snapshot?.secondaryLabel}</p>
              <p className="mt-2 text-lg font-semibold">{snapshot?.secondaryValue}</p>
            </div>
          </div>
          <p className="mt-4 rounded-xl border border-slate-800 bg-slate-950/70 px-4 py-3 text-sm text-slate-300">{snapshot?.message}</p>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {(snapshot?.items ?? []).map((item) => (
              <button
                key={item.id}
                onClick={() => setSelectedId(item.id)}
                className={(selected?.id === item.id ? "border-sky-500 bg-sky-500/10" : "border-slate-800 bg-slate-950/70") + " rounded-2xl border p-4 text-left"}
              >
                <p className="font-semibold">{item.title}</p>
                <p className="mt-1 text-sm text-slate-400">{item.subtitle}</p>
                <p className="mt-3 text-sm text-slate-300">{item.detail}</p>
              </button>
            ))}
          </div>
        </article>
        <article className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
          <h2 className="text-lg font-semibold">Selected workflow item</h2>
          {selected ? (
            <>
              <p className="mt-4 text-sm text-slate-400">{selected.subtitle}</p>
              <p className="mt-2 text-xl font-semibold">{selected.title}</p>
              <p className="mt-3 text-sm leading-6 text-slate-300">{selected.detail}</p>
              <div className="mt-4 rounded-xl border border-slate-800 bg-slate-950/70 px-4 py-3 text-sm">
                <p className="text-slate-400">Current status</p>
                <p className="mt-1 font-semibold text-white">{selected.status}</p>
                <p className="mt-2 text-slate-300">{selected.flagged ? "Needs operator attention before the workflow can close." : "This item can advance automatically if its dependencies stay healthy."}</p>
              </div>
              <button onClick={() => void run("advance-item", selected.id)} className="mt-5 rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold">{snapshot?.advanceActionLabel}</button>
            </>
          ) : null}
          <h3 className="mt-8 text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">Operational notes</h3>
          <ul className="mt-3 space-y-3 text-sm text-slate-300">
            {(snapshot?.notes ?? []).map((note) => (
              <li key={note} className="rounded-xl border border-slate-800 bg-slate-950/70 px-3 py-3">{note}</li>
            ))}
          </ul>
        </article>
      </section>
    </main>
  );
}
