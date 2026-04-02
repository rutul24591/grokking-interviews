"use client";

import { useEffect, useState } from "react";

type AdminOperation = {
  id: string;
  name: string;
  scope: string;
  risk: "low" | "medium" | "high";
  allowed: boolean;
};

type AdminApiState = {
  operatorRole: string;
  operations: AdminOperation[];
  lastMessage: string;
};

export default function Page() {
  const [state, setState] = useState<AdminApiState | null>(null);

  async function refresh() {
    const response = await fetch("/api/admin-api/state");
    setState((await response.json()) as AdminApiState);
  }

  async function act(type: "promote-role" | "toggle-operation", id?: string) {
    const response = await fetch("/api/admin-api/action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, id })
    });
    setState((await response.json()) as AdminApiState);
  }

  useEffect(() => { void refresh(); }, []);

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="text-3xl font-bold">Admin API Operations</h1>
      <p className="mt-2 text-slate-300">Inspect allowed admin endpoints, elevate operator role, and see how high-risk operations are gated.</p>
      <section className="mt-8 grid gap-6 lg:grid-cols-[320px,1fr]">
        <article className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 text-sm text-slate-300">
          <div className="text-xs uppercase tracking-wide text-slate-500">Operator role</div>
          <div className="mt-2 text-lg font-semibold text-slate-100">{state?.operatorRole}</div>
          <button onClick={() => void act("promote-role")} className="mt-4 rounded bg-sky-600 px-4 py-2 text-sm font-semibold">Promote role</button>
          <p className="mt-4 text-slate-400">{state?.lastMessage}</p>
        </article>
        <article className="space-y-4">
          {state?.operations.map((operation) => (
            <div key={operation.id} className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 text-sm text-slate-300">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="font-semibold text-slate-100">{operation.name}</div>
                  <div className="mt-1 text-xs text-slate-500">scope {operation.scope} · risk {operation.risk}</div>
                </div>
                <button onClick={() => void act("toggle-operation", operation.id)} className="rounded border border-slate-700 px-3 py-2 text-xs font-semibold">Toggle access</button>
              </div>
              <div className="mt-3 rounded border border-slate-800 px-3 py-2">allowed: {String(operation.allowed)}</div>
            </div>
          ))}
        </article>
      </section>
    </main>
  );
}
