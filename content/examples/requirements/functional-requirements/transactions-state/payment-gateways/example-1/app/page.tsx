"use client";

import { useEffect, useState } from "react";

type Attempt = { id: string; gateway: string; status: string; retryEligible: boolean };
type PageState = { routeMode: "primary" | "failover"; attempts: Attempt[]; summary: { retryEligible: number }; lastMessage: string };

export default function Page() {
  const [state, setState] = useState<PageState | null>(null);

  async function refresh() {
    const response = await fetch("/api/payment-gateways/state");
    setState((await response.json()) as PageState);
  }

  async function act(type: "switch-route" | "retry-attempt", value?: string) {
    const response = await fetch("/api/payment-gateways/action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, value })
    });
    setState((await response.json()) as PageState);
  }

  useEffect(() => { void refresh(); }, []);

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <h1 className="text-3xl font-bold">Payment Gateways Console</h1>
      <p className="mt-2 text-slate-300">Switch payment routing modes and retry degraded gateway attempts from one operational view.</p>
      <section className="mt-8 grid gap-6 lg:grid-cols-[280px,1fr]">
        <article className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 text-sm text-slate-300">
          <button onClick={() => void act("switch-route")} className="rounded bg-sky-600 px-4 py-2 text-sm font-semibold">Switch route</button>
          <div className="mt-5 grid gap-3 text-xs text-slate-400">
            <div className="rounded border border-slate-800 px-3 py-2">route mode: {state?.routeMode}</div>
            <div className="rounded border border-slate-800 px-3 py-2">retry eligible: {state?.summary.retryEligible ?? 0}</div>
          </div>
          <p className="mt-4 text-slate-400">{state?.lastMessage}</p>
        </article>
        <article className="space-y-3">
          {state?.attempts.map((attempt) => (
            <div key={attempt.id} className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 text-sm text-slate-300">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="font-semibold text-slate-100">{attempt.gateway}</div>
                  <div className="mt-1 text-xs text-slate-500">{attempt.id} · {attempt.status}</div>
                </div>
                <button onClick={() => void act("retry-attempt", attempt.id)} disabled={!attempt.retryEligible} className="rounded border border-slate-700 px-3 py-2 text-xs font-semibold disabled:opacity-40">
                  Retry
                </button>
              </div>
            </div>
          ))}
        </article>
      </section>
    </main>
  );
}
