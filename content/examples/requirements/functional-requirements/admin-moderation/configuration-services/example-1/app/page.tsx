"use client";

import { useEffect, useState } from "react";

type ConfigEntry = { id: string; key: string; value: string; environment: "prod" | "staging"; pendingReview: boolean; blastRadius: string; owner: string };

type ConfigState = {
  entries: ConfigEntry[];
  lastMessage: string;
};

export default function Page() {
  const [state, setState] = useState<ConfigState | null>(null);

  async function refresh() {
    const response = await fetch("/api/configuration/state");
    setState((await response.json()) as ConfigState);
  }

  async function review(id: string) {
    const response = await fetch("/api/configuration/action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id })
    });
    setState((await response.json()) as ConfigState);
  }

  useEffect(() => { void refresh(); }, []);

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="text-3xl font-bold">Configuration Services</h1>
      <p className="mt-2 text-slate-300">Inspect environment-specific admin configuration and clear pending review before rollout.</p>
      <section className="mt-8 space-y-4">
        {state?.entries.map((entry) => (
          <div key={entry.id} className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 text-sm text-slate-300">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="font-semibold text-slate-100">{entry.key}</div>
                <div className="mt-1 text-xs text-slate-500">{entry.environment} · value {entry.value}</div>
                <div className="mt-1 text-xs text-slate-500">owner {entry.owner} · affects {entry.blastRadius}</div>
              </div>
              <button onClick={() => void review(entry.id)} className="rounded border border-slate-700 px-3 py-2 text-xs font-semibold">Clear review</button>
            </div>
            <div className="mt-3 rounded border border-slate-800 px-3 py-2">pending review: {String(entry.pendingReview)}</div>
          </div>
        ))}
        <p className="text-sm text-slate-400">{state?.lastMessage}</p>
      </section>
    </main>
  );
}
