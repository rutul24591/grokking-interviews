"use client";

import { useEffect, useState } from "react";

type ModerationItem = { id: string; contentId: string; decision: "allow" | "review" | "block"; reason: string };

type ModerationServiceState = {
  queueDepth: number;
  items: ModerationItem[];
  lastMessage: string;
};

export default function Page() {
  const [state, setState] = useState<ModerationServiceState | null>(null);

  async function refresh() {
    const response = await fetch("/api/moderation-service/state");
    setState((await response.json()) as ModerationServiceState);
  }

  async function promote(id: string) {
    const response = await fetch("/api/moderation-service/action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id })
    });
    setState((await response.json()) as ModerationServiceState);
  }

  useEffect(() => { void refresh(); }, []);

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="text-3xl font-bold">Content Moderation Service</h1>
      <p className="mt-2 text-slate-300">Inspect moderation decisions, queue depth, and promote review items into a stricter enforcement path.</p>
      <section className="mt-8 grid gap-6 lg:grid-cols-[320px,1fr]">
        <article className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 text-sm text-slate-300">
          <div className="text-xs uppercase tracking-wide text-slate-500">Queue depth</div>
          <div className="mt-2 text-lg font-semibold text-slate-100">{state?.queueDepth}</div>
          <p className="mt-4 text-slate-400">{state?.lastMessage}</p>
        </article>
        <article className="space-y-4">
          {state?.items.map((item) => (
            <div key={item.id} className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 text-sm text-slate-300">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="font-semibold text-slate-100">{item.contentId}</div>
                  <div className="mt-1 text-xs text-slate-500">decision {item.decision} · reason {item.reason}</div>
                </div>
                <button onClick={() => void promote(item.id)} className="rounded border border-slate-700 px-3 py-2 text-xs font-semibold">Promote</button>
              </div>
            </div>
          ))}
        </article>
      </section>
    </main>
  );
}
