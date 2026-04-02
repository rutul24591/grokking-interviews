"use client";

import { useEffect, useMemo, useState } from "react";

type PageState = {
  subscription: { id: string; plan: string; view: string; nextBillDate: string; actionHint: string };
  lastMessage: string;
};

export default function Page() {
  const [state, setState] = useState<PageState | null>(null);

  async function refresh() {
    const response = await fetch("/api/subscription-management-ui/state");
    setState((await response.json()) as PageState);
  }

  async function switchView() {
    const response = await fetch("/api/subscription-management-ui/action", { method: "POST" });
    setState((await response.json()) as PageState);
  }

  useEffect(() => { void refresh(); }, []);

  const controls = useMemo(() => {
    if (!state) return [];
    return [
      state.subscription.view === "paused" ? "Resume" : null,
      state.subscription.view === "active" ? "Pause subscription" : null,
      state.subscription.view === "active" ? "Cancel at period end" : null,
      state.subscription.view === "cancel-pending" ? "Review cancellation terms" : null
    ].filter(Boolean) as string[];
  }, [state]);

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="text-3xl font-bold">Subscription Management UI</h1>
      <p className="mt-2 text-slate-300">Cycle through subscription-management views and verify the interface explains plan state, next billing, and what each action will do.</p>
      <section className="mt-8 grid gap-6 lg:grid-cols-[280px,1fr,320px]">
        <article className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 text-sm text-slate-300">
          <button onClick={switchView} className="rounded bg-sky-600 px-4 py-2 text-sm font-semibold">Switch view</button>
          <p className="mt-4 text-slate-400">{state?.lastMessage}</p>
          <div className="mt-4 grid gap-2 text-xs text-slate-400">
            {controls.map((control) => (
              <div key={control} className="rounded border border-slate-800 px-3 py-2">primary control: {control}</div>
            ))}
          </div>
        </article>
        <article className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 text-sm text-slate-300">
          <div className="grid gap-3 md:grid-cols-2">
            <div className="rounded border border-slate-800 px-3 py-2">plan: {state?.subscription.plan}</div>
            <div className="rounded border border-slate-800 px-3 py-2">view: {state?.subscription.view}</div>
            <div className="rounded border border-slate-800 px-3 py-2">next bill date: {state?.subscription.nextBillDate}</div>
            <div className="rounded border border-slate-800 px-3 py-2">action hint: {state?.subscription.actionHint}</div>
          </div>
        </article>
        <article className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 text-sm text-slate-300">
          <h2 className="text-base font-semibold text-slate-100">UI safeguards</h2>
          <div className="mt-4 grid gap-3 text-xs text-slate-400">
            <div className="rounded border border-slate-800 px-3 py-2">Active view should explain immediate versus end-of-period consequences.</div>
            <div className="rounded border border-slate-800 px-3 py-2">Paused view should show the action needed to restore access.</div>
            <div className="rounded border border-slate-800 px-3 py-2">Cancel-pending view should avoid misleading the user into thinking billing already stopped.</div>
          </div>
        </article>
      </section>
    </main>
  );
}
