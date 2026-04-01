"use client";
import { useEffect, useState } from "react";

type ModerationCase = {
  id: string;
  title: string;
  severity: "low" | "medium" | "high";
  queue: "spam" | "abuse" | "policy";
  decision: "pending" | "approve" | "reject" | "escalate";
};

type ModerationState = {
  cases: ModerationCase[];
  lastMessage: string;
};

export default function Page() {
  const [state, setState] = useState<ModerationState | null>(null);

  async function refresh() {
    const response = await fetch("/api/moderation/state");
    setState((await response.json()) as ModerationState);
  }

  async function decide(id: string, decision: ModerationCase["decision"]) {
    const response = await fetch("/api/moderation/decision", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, decision })
    });
    setState((await response.json()) as ModerationState);
  }

  useEffect(() => {
    void refresh();
  }, []);

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="text-3xl font-bold">Content Moderation</h1>
      <p className="mt-2 text-slate-300">Work a moderation queue, apply policy decisions, and keep reviewer context visible before content changes go live.</p>
      <section className="mt-8 space-y-4">
        {state?.cases.map((entry) => (
          <div key={entry.id} className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 text-sm text-slate-300">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="font-semibold text-slate-100">{entry.title}</div>
                <div className="mt-1 text-xs uppercase tracking-wide text-slate-500">{entry.queue} · {entry.severity}</div>
              </div>
              <select value={entry.decision} onChange={(event) => void decide(entry.id, event.target.value as ModerationCase["decision"])} className="rounded border border-slate-700 bg-slate-950 px-3 py-2">
                <option value="pending">pending</option>
                <option value="approve">approve</option>
                <option value="reject">reject</option>
                <option value="escalate">escalate</option>
              </select>
            </div>
          </div>
        ))}
        <p className="text-sm text-slate-400">{state?.lastMessage}</p>
      </section>
    </main>
  );
}
