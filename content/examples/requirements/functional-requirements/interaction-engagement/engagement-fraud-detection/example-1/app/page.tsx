"use client";

import { useEffect, useState } from "react";

type FraudCase = {
  id: string;
  signal: string;
  entity: string;
  decision: "monitor" | "review" | "block";
};

type FraudState = {
  mode: "strict" | "balanced" | "lenient";
  cases: FraudCase[];
  lastMessage: string;
};

export default function Page() {
  const [state, setState] = useState<FraudState | null>(null);

  async function refresh() {
    const response = await fetch("/api/engagement-fraud-detection/state");
    setState((await response.json()) as FraudState);
  }

  async function act(mode: FraudState["mode"]) {
    const response = await fetch("/api/engagement-fraud-detection/action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mode })
    });
    setState((await response.json()) as FraudState);
  }

  useEffect(() => {
    void refresh();
  }, []);

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="text-3xl font-bold">Engagement Fraud Detection</h1>
      <p className="mt-2 text-slate-300">Inspect suspicious engagement patterns, switch policy strictness, and keep fraud review actions visible before counters are trusted.</p>
      <section className="mt-8 grid gap-6 lg:grid-cols-[320px,1fr]">
        <article className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 text-sm text-slate-300">
          <div className="flex flex-wrap gap-3">
            <button onClick={() => void act("strict")} className="rounded bg-sky-600 px-4 py-2 text-sm font-semibold">Strict</button>
            <button onClick={() => void act("balanced")} className="rounded border border-slate-700 px-4 py-2 text-sm font-semibold">Balanced</button>
            <button onClick={() => void act("lenient")} className="rounded border border-slate-700 px-4 py-2 text-sm font-semibold">Lenient</button>
          </div>
          <p className="mt-4 text-slate-400">{state?.lastMessage}</p>
        </article>
        <article className="space-y-4">
          {state?.cases.map((fraudCase) => (
            <div key={fraudCase.id} className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 text-sm text-slate-300">
              <div className="font-semibold text-slate-100">{fraudCase.entity}</div>
              <div className="mt-1 text-xs text-slate-500">{fraudCase.signal}</div>
              <div className="mt-3 rounded border border-slate-800 px-3 py-2">decision: {fraudCase.decision}</div>
            </div>
          ))}
        </article>
      </section>
    </main>
  );
}
