"use client";

import { useEffect, useState } from "react";

type AuditEntry = {
  id: string;
  actor: string;
  action: string;
  target: string;
  severity: "low" | "medium" | "high";
};

type AuditState = {
  filter: "all" | "high";
  entries: AuditEntry[];
  lastMessage: string;
};

export default function Page() {
  const [state, setState] = useState<AuditState | null>(null);

  async function refresh() {
    const response = await fetch("/api/audit/state");
    setState((await response.json()) as AuditState);
  }

  async function act(filter: AuditState["filter"]) {
    const response = await fetch("/api/audit/action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ filter })
    });
    setState((await response.json()) as AuditState);
  }

  useEffect(() => { void refresh(); }, []);

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="text-3xl font-bold">Audit Logging Review</h1>
      <p className="mt-2 text-slate-300">Inspect admin actions with actor attribution, severity filters, and immutable review history.</p>
      <section className="mt-8 grid gap-6 lg:grid-cols-[320px,1fr]">
        <article className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 text-sm text-slate-300">
          <div className="flex gap-3">
            <button onClick={() => void act("all")} className="rounded bg-sky-600 px-4 py-2 text-sm font-semibold">All</button>
            <button onClick={() => void act("high")} className="rounded border border-slate-700 px-4 py-2 text-sm font-semibold">High severity</button>
          </div>
          <p className="mt-4 text-slate-400">{state?.lastMessage}</p>
        </article>
        <article className="space-y-4">
          {state?.entries.map((entry) => (
            <div key={entry.id} className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 text-sm text-slate-300">
              <div className="font-semibold text-slate-100">{entry.action}</div>
              <div className="mt-1 text-xs text-slate-500">actor {entry.actor} · target {entry.target} · severity {entry.severity}</div>
            </div>
          ))}
        </article>
      </section>
    </main>
  );
}
