"use client";

import { useEffect, useMemo, useState } from "react";

type PageState = {
  view: "entry" | "processing" | "failed" | "confirmed";
  paymentMethod: string;
  ctaEnabled: boolean;
  helper: string;
  lastMessage: string;
};

export default function Page() {
  const [state, setState] = useState<PageState | null>(null);

  async function refresh() {
    const response = await fetch("/api/payment-ui/state");
    setState((await response.json()) as PageState);
  }

  async function advance() {
    const response = await fetch("/api/payment-ui/action", { method: "POST" });
    setState((await response.json()) as PageState);
  }

  useEffect(() => { void refresh(); }, []);

  const checklist = useMemo(() => {
    if (!state) return [];
    return [
      `CTA is ${state.ctaEnabled ? "enabled" : "disabled"} in the current view.`,
      state.view === "processing" ? "Do not let users double-submit while processor state is in-flight." : null,
      state.view === "failed" ? "Show a recovery path and preserve the order context." : null,
      state.view === "confirmed" ? "Success copy should be backed by a confirmed processor outcome." : null
    ].filter(Boolean) as string[];
  }, [state]);

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="text-3xl font-bold">Payment UI States</h1>
      <p className="mt-2 text-slate-300">Walk a payment surface through method entry, processor wait, failure recovery, and confirmed success without losing transactional clarity.</p>
      <section className="mt-8 grid gap-6 lg:grid-cols-[280px,1fr,320px]">
        <article className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 text-sm text-slate-300">
          <button onClick={advance} className="rounded bg-sky-600 px-4 py-2 text-sm font-semibold">Advance UI</button>
          <p className="mt-4 text-slate-400">{state?.lastMessage}</p>
          <ul className="mt-4 grid gap-2 text-xs text-slate-400">
            {checklist.map((entry) => (
              <li key={entry} className="rounded border border-slate-800 px-3 py-2">{entry}</li>
            ))}
          </ul>
        </article>
        <article className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 text-sm text-slate-300">
          <h2 className="text-base font-semibold text-slate-100">Current payment view</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <div className="rounded border border-slate-800 px-3 py-2">view: {state?.view}</div>
            <div className="rounded border border-slate-800 px-3 py-2">payment method: {state?.paymentMethod}</div>
            <div className="rounded border border-slate-800 px-3 py-2">cta enabled: {String(state?.ctaEnabled)}</div>
            <div className="rounded border border-slate-800 px-3 py-2">helper: {state?.helper}</div>
          </div>
        </article>
        <article className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 text-sm text-slate-300">
          <h2 className="text-base font-semibold text-slate-100">User experience contract</h2>
          <div className="mt-4 grid gap-3 text-xs text-slate-400">
            <div className="rounded border border-slate-800 px-3 py-2">entry: collect method and show what happens next</div>
            <div className="rounded border border-slate-800 px-3 py-2">processing: lock form and surface waiting state clearly</div>
            <div className="rounded border border-slate-800 px-3 py-2">failed: preserve context and offer a deterministic retry path</div>
            <div className="rounded border border-slate-800 px-3 py-2">confirmed: expose receipt and downstream order status</div>
          </div>
        </article>
      </section>
    </main>
  );
}
