"use client";

import { useEffect, useState } from "react";

type Screen = { hash: string; label: string; durability: string };
type State = { screens: Screen[]; activeHash: string; logs: string[] };

export default function HashRouterLab() {
  const [state, setState] = useState<State | null>(null);

  async function refresh() {
    const response = await fetch("http://localhost:4544/state");
    setState((await response.json()) as State);
  }

  useEffect(() => {
    void refresh();
  }, []);

  async function navigate(hash: string) {
    await fetch("http://localhost:4544/navigate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ hash })
    });
    if (typeof window !== "undefined") window.location.hash = hash;
    await refresh();
  }

  const active = state?.screens.find((screen) => screen.hash === state.activeHash);

  return (
    <section className="mt-8 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
      <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-950">Hash navigation</h2>
        <div className="mt-4 flex flex-wrap gap-2 text-sm">
          {state?.screens.map((screen) => <button key={screen.hash} className={`rounded-full px-4 py-2 font-semibold ${screen.hash === state.activeHash ? "bg-slate-950 text-white" : "bg-slate-100 text-slate-800"}`} onClick={() => void navigate(screen.hash)}>{screen.label}</button>)}
        </div>
        <p className="mt-6 text-sm text-slate-700">Current hash: <span className="font-semibold text-slate-950">{state?.activeHash}</span></p>
      </article>
      <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-950">Tradeoff note</h2>
        <p className="mt-4 text-sm text-slate-700">{active?.durability}</p>
        <ul className="mt-4 space-y-2 text-sm text-slate-700">{state?.logs.map((entry) => <li key={entry}>• {entry}</li>)}</ul>
      </article>
    </section>
  );
}
