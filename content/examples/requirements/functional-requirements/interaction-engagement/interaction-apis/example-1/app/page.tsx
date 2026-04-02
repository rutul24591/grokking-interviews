"use client";

import { useEffect, useState } from "react";

type ApiAction = {
  id: string;
  name: string;
  method: string;
  status: "healthy" | "degraded" | "rate-limited";
  auth: string;
  p95Ms: number;
  fallback: string;
};

type ApiState = {
  profile: "reader" | "creator" | "moderator";
  actions: ApiAction[];
  profileSummary: { writeBudget: string; idempotency: string; degradedMode: string };
  lastMessage: string;
};

export default function Page() {
  const [state, setState] = useState<ApiState | null>(null);

  async function refresh() {
    const response = await fetch("/api/interaction-apis/state");
    setState((await response.json()) as ApiState);
  }

  async function act(profile: ApiState["profile"]) {
    const response = await fetch("/api/interaction-apis/action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ profile })
    });
    setState((await response.json()) as ApiState);
  }

  useEffect(() => { void refresh(); }, []);

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="text-3xl font-bold">Interaction APIs</h1>
      <p className="mt-2 text-slate-300">Inspect interaction endpoints by user profile so the product can expose the right write path for likes, follows, comments, and reactions.</p>
      <section className="mt-8 grid gap-6 lg:grid-cols-[320px,1fr]">
        <article className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 text-sm text-slate-300">
          <div className="flex flex-wrap gap-3">
            <button onClick={() => void act("reader")} className="rounded bg-sky-600 px-4 py-2 text-sm font-semibold">Reader</button>
            <button onClick={() => void act("creator")} className="rounded border border-slate-700 px-4 py-2 text-sm font-semibold">Creator</button>
            <button onClick={() => void act("moderator")} className="rounded border border-slate-700 px-4 py-2 text-sm font-semibold">Moderator</button>
          </div>
          <div className="mt-5 grid gap-3 text-xs text-slate-400">
            <div className="rounded border border-slate-800 px-3 py-2">write budget: {state?.profileSummary.writeBudget}</div>
            <div className="rounded border border-slate-800 px-3 py-2">idempotency: {state?.profileSummary.idempotency}</div>
            <div className="rounded border border-slate-800 px-3 py-2">degraded mode: {state?.profileSummary.degradedMode}</div>
          </div>
          <p className="mt-4 text-slate-400">{state?.lastMessage}</p>
        </article>
        <article className="space-y-4">
          {state?.actions.map((action) => (
            <div key={action.id} className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 text-sm text-slate-300">
              <div className="font-semibold text-slate-100">{action.name}</div>
              <div className="mt-1 text-xs text-slate-500">{action.method} · {action.status}</div>
              <div className="mt-3 grid gap-2 md:grid-cols-3">
                <div className="rounded border border-slate-800 px-3 py-2">auth {action.auth}</div>
                <div className="rounded border border-slate-800 px-3 py-2">p95 {action.p95Ms}ms</div>
                <div className="rounded border border-slate-800 px-3 py-2">fallback {action.fallback}</div>
              </div>
            </div>
          ))}
        </article>
      </section>
    </main>
  );
}
