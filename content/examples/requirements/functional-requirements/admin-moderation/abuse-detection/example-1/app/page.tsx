"use client";

import { useEffect, useState } from "react";

type DetectionCase = {
  id: string;
  actor: string;
  signal: string;
  riskScore: number;
  status: "queued" | "reviewing" | "escalated";
};

type AbuseState = {
  threshold: number;
  cases: DetectionCase[];
  lastMessage: string;
};

export default function Page() {
  const [state, setState] = useState<AbuseState | null>(null);

  async function refresh() {
    const response = await fetch("/api/abuse/state");
    setState((await response.json()) as AbuseState);
  }

  async function act(type: "raise-threshold" | "escalate", caseId?: string) {
    const response = await fetch("/api/abuse/action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, caseId })
    });
    setState((await response.json()) as AbuseState);
  }

  useEffect(() => {
    void refresh();
  }, []);

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="text-3xl font-bold">Abuse Detection Console</h1>
      <p className="mt-2 text-slate-300">Review flagged actors, tune detection threshold, and escalate high-risk abuse cases into moderation queues.</p>
      <section className="mt-8 grid gap-6 lg:grid-cols-[320px,1fr]">
        <article className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 text-sm text-slate-300">
          <div className="text-xs uppercase tracking-wide text-slate-500">Detection threshold</div>
          <div className="mt-2 text-lg font-semibold text-slate-100">{state?.threshold}</div>
          <button onClick={() => void act("raise-threshold")} className="mt-4 rounded bg-sky-600 px-4 py-2 text-sm font-semibold">Raise threshold</button>
          <p className="mt-4 text-slate-400">{state?.lastMessage}</p>
        </article>
        <article className="space-y-4">
          {state?.cases.map((entry) => (
            <div key={entry.id} className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 text-sm text-slate-300">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="font-semibold text-slate-100">{entry.actor}</div>
                  <div className="mt-1 text-xs text-slate-500">{entry.signal} · risk {entry.riskScore}</div>
                </div>
                <button onClick={() => void act("escalate", entry.id)} className="rounded border border-slate-700 px-3 py-2 text-xs font-semibold">Escalate</button>
              </div>
              <div className="mt-3 rounded border border-slate-800 px-3 py-2">status: {entry.status}</div>
            </div>
          ))}
        </article>
      </section>
    </main>
  );
}
