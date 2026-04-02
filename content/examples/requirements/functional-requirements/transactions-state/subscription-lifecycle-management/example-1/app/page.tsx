"use client";

import { useEffect, useMemo, useState } from "react";

type PageState = {
  subscription: { id: string; state: string; renewalDate: string; pauseReason: string };
  lastMessage: string;
};

export default function Page() {
  const [state, setState] = useState<PageState | null>(null);

  async function refresh() {
    const response = await fetch("/api/subscription-lifecycle-management/state");
    setState((await response.json()) as PageState);
  }

  async function advance() {
    const response = await fetch("/api/subscription-lifecycle-management/action", { method: "POST" });
    setState((await response.json()) as PageState);
  }

  useEffect(() => { void refresh(); }, []);

  const workflowNotes = useMemo(() => {
    if (!state) return [];
    return [
      state.subscription.state === "trial" ? "Trial needs a payment-ready path before activation." : null,
      state.subscription.state === "paused" ? "Paused access and billing state must stay aligned." : null,
      state.subscription.state === "cancelled" ? "Cancelled subscriptions should preserve history but stop new renewals." : null
    ].filter(Boolean) as string[];
  }, [state]);

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="text-3xl font-bold">Subscription Lifecycle Management</h1>
      <p className="mt-2 text-slate-300">Drive a subscription through trial, active, paused, and cancelled states while keeping billing and access implications visible.</p>
      <section className="mt-8 grid gap-6 lg:grid-cols-[280px,1fr,320px]">
        <article className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 text-sm text-slate-300">
          <button onClick={advance} className="rounded bg-sky-600 px-4 py-2 text-sm font-semibold">Advance lifecycle</button>
          <p className="mt-4 text-slate-400">{state?.lastMessage}</p>
          <ul className="mt-4 grid gap-2 text-xs text-slate-400">
            {workflowNotes.map((note) => (
              <li key={note} className="rounded border border-slate-800 px-3 py-2">{note}</li>
            ))}
          </ul>
        </article>
        <article className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 text-sm text-slate-300">
          <div className="grid gap-3 md:grid-cols-2">
            <div className="rounded border border-slate-800 px-3 py-2">subscription: {state?.subscription.id}</div>
            <div className="rounded border border-slate-800 px-3 py-2">state: {state?.subscription.state}</div>
            <div className="rounded border border-slate-800 px-3 py-2">renewal date: {state?.subscription.renewalDate}</div>
            <div className="rounded border border-slate-800 px-3 py-2">pause reason: {state?.subscription.pauseReason}</div>
          </div>
        </article>
        <article className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 text-sm text-slate-300">
          <h2 className="text-base font-semibold text-slate-100">Operational expectations</h2>
          <div className="mt-4 grid gap-3 text-xs text-slate-400">
            <div className="rounded border border-slate-800 px-3 py-2">trial → active should confirm payment and entitlement setup</div>
            <div className="rounded border border-slate-800 px-3 py-2">active → paused should suspend access without corrupting history</div>
            <div className="rounded border border-slate-800 px-3 py-2">paused/cancelled views should make renewal behavior explicit</div>
          </div>
        </article>
      </section>
    </main>
  );
}
