"use client";

import { useEffect, useState } from "react";

type StorageClass = {
  id: string;
  contentType: string;
  tier: "hot" | "warm" | "cold";
  retentionDays: number;
  encryption: "managed" | "customer-key";
  recoverySla: string;
};

type StorageState = {
  defaultTier: string;
  classes: StorageClass[];
  complianceBlocked: boolean;
  lastMessage: string;
};

export default function Page() {
  const [state, setState] = useState<StorageState | null>(null);

  async function refresh() {
    const response = await fetch("/api/storage/state");
    setState((await response.json()) as StorageState);
  }

  async function updateTier(id: string, tier: StorageClass["tier"]) {
    const response = await fetch("/api/storage/policy", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, tier })
    });
    setState((await response.json()) as StorageState);
  }

  useEffect(() => {
    void refresh();
  }, []);

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="text-3xl font-bold">Content Storage Planner</h1>
      <p className="mt-2 text-slate-300">Assign storage classes for bodies, drafts, and deleted assets while keeping retention, encryption, and recovery guarantees visible.</p>
      <section className="mt-8 grid gap-6 lg:grid-cols-[320px,1fr]">
        <article className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 text-sm text-slate-300">
          <div className="rounded-lg border border-slate-800 p-4">
            <div className="text-xs uppercase tracking-wide text-slate-500">Default placement</div>
            <div className="mt-2 font-semibold text-slate-100">{state?.defaultTier}</div>
            <div className="mt-3 text-slate-400">Compliance blocked: {String(state?.complianceBlocked)}</div>
          </div>
          <p className="mt-4 text-slate-400">{state?.lastMessage}</p>
        </article>
        <article className="space-y-4">
          {state?.classes.map((entry) => (
            <div key={entry.id} className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 text-sm text-slate-300">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="font-semibold text-slate-100">{entry.contentType}</div>
                  <div className="mt-1 text-xs uppercase tracking-wide text-slate-500">recovery: {entry.recoverySla}</div>
                </div>
                <select value={entry.tier} onChange={(event) => void updateTier(entry.id, event.target.value as StorageClass["tier"])} className="rounded border border-slate-700 bg-slate-950 px-3 py-2">
                  <option value="hot">hot</option>
                  <option value="warm">warm</option>
                  <option value="cold">cold</option>
                </select>
              </div>
              <div className="mt-3 grid gap-2 md:grid-cols-3">
                <div className="rounded border border-slate-800 px-3 py-2">retention: {entry.retentionDays}d</div>
                <div className="rounded border border-slate-800 px-3 py-2">encryption: {entry.encryption}</div>
                <div className="rounded border border-slate-800 px-3 py-2">tier: {entry.tier}</div>
              </div>
            </div>
          ))}
        </article>
      </section>
    </main>
  );
}
