"use client";

import { useEffect, useState } from "react";

type PageState = {
  shipment: { trackingId: string; milestone: string; eta: string; exception: string };
  lastMessage: string;
};

export default function Page() {
  const [state, setState] = useState<PageState | null>(null);

  async function refresh() {
    const response = await fetch("/api/order-tracking-ui/state");
    setState((await response.json()) as PageState);
  }

  async function advance() {
    const response = await fetch("/api/order-tracking-ui/action", { method: "POST" });
    setState((await response.json()) as PageState);
  }

  useEffect(() => { void refresh(); }, []);

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <h1 className="text-3xl font-bold">Order Tracking UI</h1>
      <p className="mt-2 text-slate-300">Advance shipment milestones and verify the right ETA and exception message are displayed.</p>
      <section className="mt-8 grid gap-6 lg:grid-cols-[280px,1fr]">
        <article className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 text-sm text-slate-300">
          <button onClick={advance} className="rounded bg-sky-600 px-4 py-2 text-sm font-semibold">Advance shipment</button>
          <p className="mt-4 text-slate-400">{state?.lastMessage}</p>
        </article>
        <article className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 text-sm text-slate-300">
          <div className="grid gap-3 md:grid-cols-2">
            <div className="rounded border border-slate-800 px-3 py-2">tracking id: {state?.shipment.trackingId}</div>
            <div className="rounded border border-slate-800 px-3 py-2">milestone: {state?.shipment.milestone}</div>
            <div className="rounded border border-slate-800 px-3 py-2">eta: {state?.shipment.eta}</div>
            <div className="rounded border border-slate-800 px-3 py-2">exception: {state?.shipment.exception}</div>
          </div>
        </article>
      </section>
    </main>
  );
}
