"use client";

import { useEffect, useState } from "react";

type PageState = {
  payment: { id: string; stage: string; amount: string; exception: string };
  lastMessage: string;
};

export default function Page() {
  const [state, setState] = useState<PageState | null>(null);

  async function refresh() {
    const response = await fetch("/api/payment-processing/state");
    setState((await response.json()) as PageState);
  }

  async function act(type: "authorize" | "capture" | "fail") {
    const response = await fetch("/api/payment-processing/action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type })
    });
    setState((await response.json()) as PageState);
  }

  useEffect(() => { void refresh(); }, []);

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <h1 className="text-3xl font-bold">Payment Processing Console</h1>
      <p className="mt-2 text-slate-300">Move a payment from authorization to capture and inspect how failure state changes the transaction path.</p>
      <section className="mt-8 grid gap-6 lg:grid-cols-[280px,1fr]">
        <article className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 text-sm text-slate-300">
          <div className="grid gap-3">
            <button onClick={() => void act("authorize")} className="rounded bg-sky-600 px-4 py-2 text-sm font-semibold">Authorize</button>
            <button onClick={() => void act("capture")} className="rounded border border-slate-700 px-4 py-2 text-sm font-semibold">Capture</button>
            <button onClick={() => void act("fail")} className="rounded border border-slate-700 px-4 py-2 text-sm font-semibold">Fail</button>
          </div>
          <p className="mt-4 text-slate-400">{state?.lastMessage}</p>
        </article>
        <article className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 text-sm text-slate-300">
          <div className="grid gap-3 md:grid-cols-2">
            <div className="rounded border border-slate-800 px-3 py-2">payment: {state?.payment.id}</div>
            <div className="rounded border border-slate-800 px-3 py-2">stage: {state?.payment.stage}</div>
            <div className="rounded border border-slate-800 px-3 py-2">amount: {state?.payment.amount}</div>
            <div className="rounded border border-slate-800 px-3 py-2">exception: {state?.payment.exception}</div>
          </div>
        </article>
      </section>
    </main>
  );
}
