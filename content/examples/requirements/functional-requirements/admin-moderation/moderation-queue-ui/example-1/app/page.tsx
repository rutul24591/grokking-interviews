"use client";

import { useEffect, useState } from "react";

type QueueItem = {
  id: string;
  subject: string;
  queue: "spam" | "safety" | "appeals";
  status: "new" | "claimed" | "resolved";
};

type QueueState = {
  activeQueue: string;
  items: QueueItem[];
  lastMessage: string;
};

export default function Page() {
  const [state, setState] = useState<QueueState | null>(null);

  async function refresh() {
    const response = await fetch("/api/moderation-queue/state");
    setState((await response.json()) as QueueState);
  }

  async function act(type: "switch-queue" | "claim-item", id?: string) {
    const response = await fetch("/api/moderation-queue/action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, id })
    });
    setState((await response.json()) as QueueState);
  }

  useEffect(() => { void refresh(); }, []);

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="text-3xl font-bold">Moderation Queue UI</h1>
      <p className="mt-2 text-slate-300">Switch between review queues, claim items, and keep adjudication work visible to supervisors.</p>
      <section className="mt-8 grid gap-6 lg:grid-cols-[320px,1fr]">
        <article className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 text-sm text-slate-300">
          <div className="text-xs uppercase tracking-wide text-slate-500">Active queue</div>
          <div className="mt-2 text-lg font-semibold text-slate-100">{state?.activeQueue}</div>
          <button onClick={() => void act("switch-queue")} className="mt-4 rounded bg-sky-600 px-4 py-2 text-sm font-semibold">Switch queue</button>
          <p className="mt-4 text-slate-400">{state?.lastMessage}</p>
        </article>
        <article className="space-y-4">
          {state?.items.map((item) => (
            <div key={item.id} className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 text-sm text-slate-300">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="font-semibold text-slate-100">{item.subject}</div>
                  <div className="mt-1 text-xs text-slate-500">{item.queue} · {item.status}</div>
                </div>
                <button onClick={() => void act("claim-item", item.id)} className="rounded border border-slate-700 px-3 py-2 text-xs font-semibold">Claim</button>
              </div>
            </div>
          ))}
        </article>
      </section>
    </main>
  );
}
