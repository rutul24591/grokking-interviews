"use client";

import { useEffect, useState } from "react";

type Flag = { id: string; name: string; enabled: boolean; rolloutPercent: number; reviewRequired: boolean };

type FlagState = {
  flags: Flag[];
  lastMessage: string;
};

export default function Page() {
  const [state, setState] = useState<FlagState | null>(null);

  async function refresh() {
    const response = await fetch("/api/flags/state");
    setState((await response.json()) as FlagState);
  }

  async function act(id: string) {
    const response = await fetch("/api/flags/action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id })
    });
    setState((await response.json()) as FlagState);
  }

  useEffect(() => { void refresh(); }, []);

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="text-3xl font-bold">Feature Flag UI</h1>
      <p className="mt-2 text-slate-300">Control admin features with rollout percentages, review requirements, and explicit kill-switch handling.</p>
      <section className="mt-8 space-y-4">
        {state?.flags.map((flag) => (
          <div key={flag.id} className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 text-sm text-slate-300">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="font-semibold text-slate-100">{flag.name}</div>
                <div className="mt-1 text-xs text-slate-500">enabled {String(flag.enabled)} · rollout {flag.rolloutPercent}% · review {String(flag.reviewRequired)}</div>
              </div>
              <button onClick={() => void act(flag.id)} className="rounded border border-slate-700 px-3 py-2 text-xs font-semibold">Toggle</button>
            </div>
          </div>
        ))}
        <p className="text-sm text-slate-400">{state?.lastMessage}</p>
      </section>
    </main>
  );
}
