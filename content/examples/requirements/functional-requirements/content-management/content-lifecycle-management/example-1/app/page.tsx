"use client";
import { useEffect, useState } from "react";

type LifecycleEntry = {
  id: string;
  title: string;
  stage: "draft" | "review" | "published" | "archived";
  owner: string;
  nextAction: string;
};

type LifecycleState = {
  entries: LifecycleEntry[];
  lastMessage: string;
};

export default function Page() {
  const [state, setState] = useState<LifecycleState | null>(null);

  async function refresh() {
    const response = await fetch("/api/lifecycle/state");
    setState((await response.json()) as LifecycleState);
  }

  async function transition(id: string, stage: LifecycleEntry["stage"]) {
    const response = await fetch("/api/lifecycle/transition", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, stage })
    });
    setState((await response.json()) as LifecycleState);
  }

  useEffect(() => {
    void refresh();
  }, []);

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="text-3xl font-bold">Content Lifecycle Management</h1>
      <p className="mt-2 text-slate-300">Track how content moves through review gates, publishing, and retirement while keeping editorial ownership visible.</p>
      <section className="mt-8 space-y-4">
        {state?.entries.map((entry) => (
          <div key={entry.id} className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 text-sm text-slate-300">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="font-semibold text-slate-100">{entry.title}</div>
                <div className="mt-1 text-xs uppercase tracking-wide text-slate-500">owner: {entry.owner}</div>
              </div>
              <select value={entry.stage} onChange={(event) => void transition(entry.id, event.target.value as LifecycleEntry["stage"])} className="rounded border border-slate-700 bg-slate-950 px-3 py-2">
                <option value="draft">draft</option>
                <option value="review">review</option>
                <option value="published">published</option>
                <option value="archived">archived</option>
              </select>
            </div>
            <div className="mt-3 grid gap-2 md:grid-cols-2">
              <div className="rounded border border-slate-800 px-3 py-2">Stage: {entry.stage}</div>
              <div className="rounded border border-slate-800 px-3 py-2">Next action: {entry.nextAction}</div>
            </div>
          </div>
        ))}
        <p className="text-sm text-slate-400">{state?.lastMessage}</p>
      </section>
    </main>
  );
}
