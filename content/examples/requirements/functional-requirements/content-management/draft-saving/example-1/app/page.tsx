"use client";

import { useEffect, useState } from "react";

type Snapshot = {
  id: string;
  savedAt: string;
  status: "queued" | "saved" | "conflict";
};

type DraftState = {
  body: string;
  syncStatus: "idle" | "saving" | "saved" | "conflict";
  snapshots: Snapshot[];
  lastMessage: string;
};

export default function Page() {
  const [state, setState] = useState<DraftState | null>(null);

  async function refresh() {
    const response = await fetch("/api/draft-saving/state");
    setState((await response.json()) as DraftState);
  }

  async function act(type: "edit" | "save" | "conflict") {
    const response = await fetch("/api/draft-saving/action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type })
    });
    setState((await response.json()) as DraftState);
  }

  useEffect(() => {
    void refresh();
  }, []);

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="text-3xl font-bold">Draft Saving Workbench</h1>
      <p className="mt-2 text-slate-300">Simulate autosave, successful persistence, and stale-write conflicts while an editor is still typing.</p>
      <section className="mt-8 grid gap-6 lg:grid-cols-[1.1fr,0.9fr]">
        <article className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
          <textarea value={state?.body ?? ""} readOnly className="h-56 w-full rounded border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-200" />
          <div className="mt-4 flex gap-3">
            <button onClick={() => void act("edit")} className="rounded border border-slate-700 px-4 py-2 text-sm font-semibold">
              Simulate edit
            </button>
            <button onClick={() => void act("save")} className="rounded bg-emerald-600 px-4 py-2 text-sm font-semibold text-white">
              Save now
            </button>
            <button onClick={() => void act("conflict")} className="rounded border border-amber-700 px-4 py-2 text-sm font-semibold text-amber-300">
              Trigger conflict
            </button>
          </div>
        </article>
        <article className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 text-sm text-slate-300">
          <div className="text-xs uppercase tracking-wide text-slate-400">Autosave status</div>
          <div className="mt-2 text-lg font-semibold text-slate-100">{state?.syncStatus}</div>
          <div className="mt-4 space-y-3">
            {state?.snapshots.map((snapshot) => (
              <div key={snapshot.id} className="rounded-lg border border-slate-800 bg-slate-950/60 px-3 py-2">
                <div className="font-semibold text-slate-100">{snapshot.id}</div>
                <div className="mt-1 text-xs text-slate-400">{snapshot.savedAt} · {snapshot.status}</div>
              </div>
            ))}
          </div>
          <p className="mt-4 text-slate-400">{state?.lastMessage}</p>
        </article>
      </section>
    </main>
  );
}
