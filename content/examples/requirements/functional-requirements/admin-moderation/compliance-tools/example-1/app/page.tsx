"use client";

import { useEffect, useState } from "react";

type Obligation = { id: string; rule: string; status: "open" | "reviewing" | "resolved"; owner: string };

type ComplianceState = {
  obligations: Obligation[];
  region: string;
  lastMessage: string;
};

export default function Page() {
  const [state, setState] = useState<ComplianceState | null>(null);

  async function refresh() {
    const response = await fetch("/api/compliance/state");
    setState((await response.json()) as ComplianceState);
  }

  async function resolve(id: string) {
    const response = await fetch("/api/compliance/action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id })
    });
    setState((await response.json()) as ComplianceState);
  }

  useEffect(() => { void refresh(); }, []);

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="text-3xl font-bold">Compliance Tools</h1>
      <p className="mt-2 text-slate-300">Track active regulatory obligations, owners, and remediation progress for admin operations.</p>
      <section className="mt-8 grid gap-6 lg:grid-cols-[320px,1fr]">
        <article className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 text-sm text-slate-300">
          <div className="text-xs uppercase tracking-wide text-slate-500">Region</div>
          <div className="mt-2 text-lg font-semibold text-slate-100">{state?.region}</div>
          <p className="mt-4 text-slate-400">{state?.lastMessage}</p>
        </article>
        <article className="space-y-4">
          {state?.obligations.map((entry) => (
            <div key={entry.id} className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 text-sm text-slate-300">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="font-semibold text-slate-100">{entry.rule}</div>
                  <div className="mt-1 text-xs text-slate-500">owner {entry.owner} · status {entry.status}</div>
                </div>
                <button onClick={() => void resolve(entry.id)} className="rounded border border-slate-700 px-3 py-2 text-xs font-semibold">Resolve</button>
              </div>
            </div>
          ))}
        </article>
      </section>
    </main>
  );
}
