"use client";

import { useEffect, useState } from "react";

type DeleteState = {
  itemTitle: string;
  dependencyCount: number;
  deletionMode: "archive" | "delete";
  confirmed: boolean;
  lastMessage: string;
};

export default function Page() {
  const [state, setState] = useState<DeleteState | null>(null);

  async function refresh() {
    const response = await fetch("/api/delete-content/state");
    setState((await response.json()) as DeleteState);
  }

  async function act(type: "toggle-mode" | "confirm") {
    const response = await fetch("/api/delete-content/action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type })
    });
    setState((await response.json()) as DeleteState);
  }

  useEffect(() => {
    void refresh();
  }, []);

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <h1 className="text-3xl font-bold">Delete Content UI</h1>
      <p className="mt-2 text-slate-300">Surface the operational impact of content deletion before an editor confirms a destructive action.</p>
      <section className="mt-8 grid gap-6 lg:grid-cols-[1fr,320px]">
        <article className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 text-sm text-slate-300">
          <div className="text-xs uppercase tracking-wide text-slate-400">Target</div>
          <div className="mt-2 text-lg font-semibold text-slate-100">{state?.itemTitle}</div>
          <div className="mt-4 rounded-lg border border-slate-800 bg-slate-950/60 p-4">
            Impacted surfaces: {state?.dependencyCount} feed or search references
          </div>
          <div className="mt-4 flex gap-3">
            <button onClick={() => void act("toggle-mode")} className="rounded border border-slate-700 px-4 py-2 text-sm font-semibold">
              Switch to {state?.deletionMode === "archive" ? "delete" : "archive"}
            </button>
            <button onClick={() => void act("confirm")} className="rounded bg-rose-600 px-4 py-2 text-sm font-semibold text-white">
              Confirm {state?.deletionMode}
            </button>
          </div>
        </article>
        <article className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 text-sm text-slate-300">
          <div className="text-xs uppercase tracking-wide text-slate-400">Decision status</div>
          <div className="mt-2 text-lg font-semibold text-slate-100">{state?.confirmed ? "Executed" : "Pending review"}</div>
          <p className="mt-4">Mode: {state?.deletionMode}</p>
          <p className="mt-4 text-slate-400">{state?.lastMessage}</p>
        </article>
      </section>
    </main>
  );
}
