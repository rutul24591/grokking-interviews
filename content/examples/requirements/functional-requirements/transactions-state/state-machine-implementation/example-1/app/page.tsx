"use client";

import { useEffect, useMemo, useState } from "react";

type PageState = { current: string; nextStates: string[]; lastMessage: string };

export default function Page() {
  const [state, setState] = useState<PageState | null>(null);

  async function refresh() {
    const response = await fetch("/api/state-machine/state");
    setState((await response.json()) as PageState);
  }

  async function transition(value: string) {
    const response = await fetch("/api/state-machine/action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "transition", value })
    });
    setState((await response.json()) as PageState);
  }

  useEffect(() => { void refresh(); }, []);

  const lanes = useMemo(() => {
    if (!state) return [];
    return ["created", "authorized", "captured", "refunded"].map((lane) => ({
      lane,
      active: lane === state.current,
      reachable: state.nextStates.includes(lane)
    }));
  }, [state]);

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="text-3xl font-bold">Transaction State Machine</h1>
      <p className="mt-2 text-slate-300">Run legal transaction transitions, inspect what comes next, and verify impossible moves are rejected before side effects begin.</p>
      <section className="mt-8 grid gap-6 lg:grid-cols-[280px,1fr,320px]">
        <article className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 text-sm text-slate-300">
          <div className="rounded border border-slate-800 px-3 py-2 text-xs text-slate-400">current state: {state?.current}</div>
          <div className="mt-4 grid gap-3">
            {[
              ["authorized", "Authorize"],
              ["captured", "Capture"],
              ["refunded", "Refund"]
            ].map(([target, label]) => (
              <button key={target} onClick={() => void transition(target)} className="rounded border border-slate-700 px-4 py-2 text-sm font-semibold">
                {label}
              </button>
            ))}
          </div>
          <p className="mt-4 text-slate-400">{state?.lastMessage}</p>
        </article>
        <article className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 text-sm text-slate-300">
          <h2 className="text-base font-semibold text-slate-100">Lifecycle lanes</h2>
          <div className="mt-4 grid gap-3">
            {lanes.map((lane) => (
              <div key={lane.lane} className={`rounded border px-3 py-3 text-xs ${lane.active ? "border-sky-500 bg-slate-950 text-slate-100" : "border-slate-800 text-slate-400"}`}>
                <div className="font-semibold">{lane.lane}</div>
                <div className="mt-1">{lane.active ? "current state" : lane.reachable ? "reachable next" : "not currently reachable"}</div>
              </div>
            ))}
          </div>
        </article>
        <article className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 text-sm text-slate-300">
          <h2 className="text-base font-semibold text-slate-100">Guardrails</h2>
          <div className="mt-4 grid gap-3 text-xs text-slate-400">
            <div className="rounded border border-slate-800 px-3 py-2">Each transition should own its side effects explicitly.</div>
            <div className="rounded border border-slate-800 px-3 py-2">Invalid transitions should fail before inventory, billing, or fulfillment writes happen.</div>
            <div className="rounded border border-slate-800 px-3 py-2">The reachable next-state list is the UI contract for downstream operations.</div>
          </div>
        </article>
      </section>
    </main>
  );
}
