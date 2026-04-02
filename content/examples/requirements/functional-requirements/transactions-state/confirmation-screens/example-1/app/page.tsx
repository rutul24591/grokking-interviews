"use client";

import { useEffect, useMemo, useState } from "react";

type ConfirmationState = {
  outcome: "success" | "pending" | "failed";
  confirmation: {
    paymentStatus: string;
    fulfillmentStatus: string;
    nextAction: string;
    reference: string;
  };
  lastMessage: string;
};

export default function Page() {
  const [state, setState] = useState<ConfirmationState | null>(null);

  async function refresh() {
    const response = await fetch("/api/confirmation-screens/state");
    setState((await response.json()) as ConfirmationState);
  }

  async function switchOutcome() {
    const response = await fetch("/api/confirmation-screens/action", { method: "POST" });
    setState((await response.json()) as ConfirmationState);
  }

  useEffect(() => {
    void refresh();
  }, []);

  const notes = useMemo(() => {
    if (!state) return [];
    return [
      state.outcome === "success" ? "Safe to expose receipt and fulfillment ETA." : null,
      state.outcome === "pending" ? "Hide final success copy until the settlement webhook lands." : null,
      state.outcome === "failed" ? "Drive the user back into recovery without implying the order exists." : null
    ].filter(Boolean) as string[];
  }, [state]);

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="text-3xl font-bold">Confirmation Screen States</h1>
      <p className="mt-2 text-slate-300">Exercise success, pending, and failed transaction outcomes and verify the user sees the right confirmation copy, references, and recovery path.</p>
      <section className="mt-8 grid gap-6 lg:grid-cols-[280px,1fr,320px]">
        <article className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 text-sm text-slate-300">
          <button onClick={switchOutcome} className="rounded bg-sky-600 px-4 py-2 text-sm font-semibold">Switch outcome</button>
          <div className="mt-5 rounded border border-slate-800 px-3 py-2 text-xs text-slate-400">current outcome: {state?.outcome}</div>
          <ul className="mt-4 grid gap-2 text-xs text-slate-400">
            {notes.map((note) => (
              <li key={note} className="rounded border border-slate-800 px-3 py-2">{note}</li>
            ))}
          </ul>
          <p className="mt-4 text-slate-400">{state?.lastMessage}</p>
        </article>
        <article className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 text-sm text-slate-300">
          <h2 className="text-base font-semibold text-slate-100">Confirmation payload</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <div className="rounded border border-slate-800 px-3 py-2">payment: {state?.confirmation.paymentStatus}</div>
            <div className="rounded border border-slate-800 px-3 py-2">fulfillment: {state?.confirmation.fulfillmentStatus}</div>
            <div className="rounded border border-slate-800 px-3 py-2">next action: {state?.confirmation.nextAction}</div>
            <div className="rounded border border-slate-800 px-3 py-2">reference: {state?.confirmation.reference}</div>
          </div>
        </article>
        <article className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 text-sm text-slate-300">
          <h2 className="text-base font-semibold text-slate-100">Rendering guardrails</h2>
          <div className="mt-4 grid gap-3 text-xs text-slate-400">
            <div className="rounded border border-slate-800 px-3 py-2">success screen should only render when payment is captured</div>
            <div className="rounded border border-slate-800 px-3 py-2">pending screen should route users to tracking, not fulfillment promises</div>
            <div className="rounded border border-slate-800 px-3 py-2">failed screen should foreground retry and support actions</div>
          </div>
        </article>
      </section>
    </main>
  );
}
