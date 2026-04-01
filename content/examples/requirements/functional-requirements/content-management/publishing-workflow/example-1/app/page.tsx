"use client";

import { useEffect, useState } from "react";

type WorkflowState = {
  title: string;
  stage: "draft" | "review" | "approved" | "published";
  approver: string | null;
  blockers: string[];
  lastMessage: string;
};

export default function Page() {
  const [state, setState] = useState<WorkflowState | null>(null);

  async function refresh() {
    const response = await fetch("/api/publishing/state");
    setState((await response.json()) as WorkflowState);
  }

  async function act(type: "advance" | "clear-blocker") {
    const response = await fetch("/api/publishing/action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type })
    });
    setState((await response.json()) as WorkflowState);
  }

  useEffect(() => { void refresh(); }, []);

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <h1 className="text-3xl font-bold">Publishing Workflow</h1>
      <p className="mt-2 text-slate-300">Advance content through editorial stages while respecting approval gates and blocking conditions.</p>
      <section className="mt-8 grid gap-6 lg:grid-cols-[1fr,320px]">
        <article className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 text-sm text-slate-300">
          <div className="text-xs uppercase tracking-wide text-slate-400">Current stage</div>
          <div className="mt-2 text-lg font-semibold text-slate-100">{state?.stage}</div>
          <div className="mt-2">Approver: {state?.approver ?? "pending"}</div>
          <div className="mt-4 flex gap-3">
            <button onClick={() => void act("clear-blocker")} className="rounded border border-slate-700 px-4 py-2 text-sm font-semibold">Clear blocker</button>
            <button onClick={() => void act("advance")} className="rounded bg-sky-600 px-4 py-2 text-sm font-semibold">Advance workflow</button>
          </div>
        </article>
        <article className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 text-sm text-slate-300">
          <div className="text-xs uppercase tracking-wide text-slate-400">Publish blockers</div>
          <div className="mt-4 space-y-2">
            {state?.blockers.map((blocker) => (
              <div key={blocker} className="rounded border border-slate-800 bg-slate-950/60 px-3 py-2">{blocker}</div>
            ))}
          </div>
          <p className="mt-4 text-slate-400">{state?.lastMessage}</p>
        </article>
      </section>
    </main>
  );
}
